package com.uxstudio.contactapp.service.impl;

import com.uxstudio.contactapp.dto.contact.ContactRequest;
import com.uxstudio.contactapp.dto.contact.ContactResponse;
import com.uxstudio.contactapp.exception.ContactNotDeleted;
import com.uxstudio.contactapp.exception.ContactNotFoundException;
import com.uxstudio.contactapp.exception.UserNotFoundException;
import com.uxstudio.contactapp.model.Contact;
import com.uxstudio.contactapp.repository.ContactRepository;
import com.uxstudio.contactapp.service.AmazonS3Service;
import com.uxstudio.contactapp.service.ContactService;
import com.uxstudio.contactapp.util.SecurityUtils;
import com.uxstudio.contactapp.util.InputValidator;
import com.uxstudio.contactapp.util.RequestValidator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.Instant;
import java.util.*;

@Service
public class ContactServiceImpl implements ContactService {
    private final ContactRepository contactRepository;
    private final SecurityUtils securityUtils;
    private final AmazonS3Service s3Service;
    private final Logger LOGGER = LoggerFactory.getLogger(getClass());
    @Value("${aws.s3.region}")
    private String s3RegionName;
    @Value("${aws.s3.bucket.name}")
    private String s3BucketName;
    private final MongoTemplate mongoTemplate;


    public ContactServiceImpl(ContactRepository contactRepository, SecurityUtils securityUtils, AmazonS3Service s3Service, MongoTemplate mongoTemplate) {
        this.contactRepository = contactRepository;
        this.securityUtils = securityUtils;
        this.s3Service = s3Service;
        this.mongoTemplate = mongoTemplate;
    }


    @Override
    public List<ContactResponse> getContactsByOwner() {
        return contactRepository.findContactsByOwnerUserName(
                        securityUtils
                                .currentUsername()
                                .orElseThrow(() -> new IllegalArgumentException("Username is not present"))
                )
                .stream()
                .map(ContactResponse::new)
                .toList();
    }

    @Override
    public void deleteMyContact(String id) throws ContactNotDeleted {
        InputValidator.requireValidId(id, "Contact ID cannot be null or empty");
        
        String currentUserName = securityUtils
                .currentUsername()
                .orElseThrow(() -> new IllegalArgumentException("Username is not present"));

        var deleted = contactRepository.deleteContactByIdAndOwnerUserName(id, currentUserName);
        if (deleted == 0) {
            LOGGER.warn("Failed to delete contact - contactId: {}, owner: {} - not found", id, currentUserName);
            throw new ContactNotDeleted("Failed to delete contact");
        }
        
        LOGGER.info("Contact deleted successfully - contactId: {}, owner: {}", id, currentUserName);
    }

    @Override
    public ContactResponse toggleMuteContact(String id) throws ContactNotFoundException {
        InputValidator.requireValidId(id, "Contact ID cannot be null or empty");

        String currentUserName = securityUtils
                .currentUsername()
                .orElseThrow(() -> new IllegalArgumentException("Username is not present"));

        Contact contact = contactRepository
                .findContactByIdAndOwnerUserName(id, currentUserName)
                .orElseThrow(() -> {
                    LOGGER.warn("Contact not found contactId: {}, owner: {}", id, currentUserName);
                    return new ContactNotFoundException("Not found");
                });

        if (!contact.getOwnerUserName().equals(currentUserName)) {
            LOGGER.warn("Unauthorized mute toggle attempt - contactId: {}", id);
            throw new IllegalArgumentException("Unauthorized attempt");
        }

        contact.setIsMuted(!contact.getIsMuted());
        Contact saved = contactRepository.save(contact);
        
        LOGGER.info("Contact mute status toggled - contactId: {}, owner: {}, newStatus: {}", id, currentUserName, saved.getIsMuted());
        return new ContactResponse(saved);
    }

    @Override
    public List<ContactResponse> findByFullNameContainingOrPhoneNumberContaining(String param) throws UserNotFoundException {
        RequestValidator.validateSearchParam(param);
        
        String userName = securityUtils.currentUsername()
                .orElseThrow(() -> new UserNotFoundException("User not present"));
        
        List<ContactResponse> results = searchContactByParam(param, userName)
                .stream().map(ContactResponse::new)
                .toList();
        
        LOGGER.info("Search completed - owner: {}, searchParam: {}, resultCount: {}", userName, param, results.size());
        return results;
    }

    private List<Contact> searchContactByParam(String param, String owner) {
        Query query = new Query();
        query.addCriteria(Criteria.where("ownerUserName").is(owner));
        query.addCriteria(new Criteria().orOperator(
                Criteria.where("fullName").regex(param, "i"),
                Criteria.where("phoneNumber").regex(param, "i")
        ));
        return mongoTemplate.find(query, Contact.class);
    }

    @Override
    public ContactResponse createContact(ContactRequest contactRequest) throws IOException {
        RequestValidator.validateContactRequest(contactRequest);
        
        String owner = securityUtils
                .currentUsername()
                .orElseThrow(() -> new IllegalArgumentException("Username is not present"));

        String url = null;
        if (contactRequest.getProfilePicture() != null) {
            url = getImageURL(contactRequest.getProfilePicture());
            LOGGER.debug("Profile picture uploaded for new contact - owner: {}, imageUrl: {}", owner, url);
        }
        Contact contact = Contact.builder()
                .email(contactRequest.getEmail())
                .phoneNumber(contactRequest.getPhoneNumber())
                .createdAt(Instant.now())
                .fullName(contactRequest.getFullName())
                .lastModified(Instant.now())
                .ownerUserName(owner)
                .pictureUrl(url)
                .isMuted(Boolean.FALSE)
                .build();
        contact = contactRepository.save(contact);
        
        LOGGER.info("Contact created successfully - contactId: {}, owner: {}", contact.getId(), owner);
        return new ContactResponse(contact);
    }

    @Override
    public ContactResponse updateContact(ContactRequest contactData, String id) throws ContactNotFoundException, IOException {
        InputValidator.requireValidId(id, "Contact ID cannot be null or empty");

        Contact contact = contactRepository
                .findById(id)
                .orElseThrow(() -> new ContactNotFoundException("Contact not found"));

        String currentUserName = securityUtils
                .currentUsername()
                .orElseThrow(() -> new IllegalArgumentException("Username is not present"));

        if (!contact.getOwnerUserName().equals(currentUserName)) {
            LOGGER.warn("Unauthorized contact update attempt for contactId: {}", id);
            throw new IllegalArgumentException("Unauthorized attempt");
        }

        // Update fields only if provided and not blank
        if (InputValidator.shouldUpdate(contactData.getEmail())) {
            contact.setEmail(contactData.getEmail());
        }
        if (InputValidator.shouldUpdate(contactData.getFullName())) {
            contact.setFullName(contactData.getFullName());
        }
        if (InputValidator.shouldUpdate(contactData.getPhoneNumber())) {
            contact.setPhoneNumber(contactData.getPhoneNumber());
        }

        if (contactData.getProfilePicture() != null && !contactData.getProfilePicture().isEmpty()) {
            String avatarUrl = getImageURL(contactData.getProfilePicture());
            contact.setPictureUrl(avatarUrl);
        } else if (Boolean.TRUE.equals(contactData.getDeletePicture())) {
            contact.setPictureUrl(null);
        }

        contact.setLastModified(Instant.now());
        contact = contactRepository.save(contact);

        LOGGER.info("Contact updated successfully - contactId: {}, owner: {}", contact.getId(), currentUserName);

        return new ContactResponse(contact);
    }

    public String getImageURL(MultipartFile file) throws IOException {
        String folderName = "uxcontactapp";
        String extension = StringUtils.getFilenameExtension(file.getOriginalFilename());
        String key = String.format("%s/%s.%s", folderName, UUID.randomUUID(), extension);
        String url = "https://" + s3BucketName + ".s3." + s3RegionName + ".amazonaws.com/" + key;
        uploadTos3Bucket(file, key);
        return url;
    }

    private void uploadTos3Bucket(MultipartFile file, String key) throws IOException {
        if (file.isEmpty()) {
            throw new IllegalStateException("Cannot upload empty file");
        }
        Map<String, String> metadata = new HashMap<>();
        metadata.put("Content-Type", file.getContentType());
        metadata.put("Content-Length", String.valueOf(file.getSize()));
        s3Service.upload(s3BucketName, key, Optional.of(metadata), file.getInputStream());
    }
}
