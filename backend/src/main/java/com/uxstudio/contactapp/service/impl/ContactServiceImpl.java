package com.uxstudio.contactapp.service.impl;

import com.uxstudio.contactapp.dto.contact.ContactRequest;
import com.uxstudio.contactapp.dto.contact.ContactResponse;
import com.uxstudio.contactapp.exception.ContactNotDeleted;
import com.uxstudio.contactapp.exception.ContactNotFoundException;
import com.uxstudio.contactapp.model.Contact;
import com.uxstudio.contactapp.repository.ContactRepository;
import com.uxstudio.contactapp.service.AmazonS3Service;
import com.uxstudio.contactapp.service.ContactService;
import com.uxstudio.contactapp.util.SecurityUtils;
import org.springframework.beans.factory.annotation.Value;
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
    @Value("${aws.s3.region}")
    private String s3RegionName;
    @Value("${aws.s3.bucket.name}")
    private String s3BucketName;


    public ContactServiceImpl(ContactRepository contactRepository, SecurityUtils securityUtils, AmazonS3Service s3Service) {
        this.contactRepository = contactRepository;
        this.securityUtils = securityUtils;
        this.s3Service = s3Service;
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
        String currentUserName = securityUtils
                .currentUsername()
                .orElseThrow(() -> new IllegalArgumentException("Username is not present"));

        var deleted = contactRepository.deleteContactByIdAndOwnerUserName(id, currentUserName);
        if (deleted == 0) throw new ContactNotDeleted("Contact not found or something went wrong");
    }

    @Override
    public ContactResponse toggleMuteContact(String id) throws ContactNotFoundException {
        if (id == null || id.isEmpty()) {
            throw new IllegalArgumentException("Id can not be null");
        }

        String currentUserName = securityUtils
                .currentUsername()
                .orElseThrow(() -> new IllegalArgumentException("Username is not present"));

        Contact contact = contactRepository
                .findContactByIdAndOwnerUserName(id, currentUserName)
                .orElseThrow(() -> new ContactNotFoundException("Not found"));

        if (!contact.getOwnerUserName().equals(currentUserName)) {
            throw new IllegalArgumentException("Something went wrong");
        }

        contact.setIsMuted(!contact.getIsMuted());

        System.out.println(contact.getIsMuted());

        return new ContactResponse(contactRepository.save(contact));
    }

    @Override
    public ContactResponse createContact(ContactRequest contactRequest) throws IOException {
        String url = null;
        if (contactRequest.getProfilePicture() != null) {
            url = getImageURL(contactRequest.getProfilePicture());
        }
        Contact contact = Contact.builder()
                .email(contactRequest.getEmail())
                .phoneNumber(contactRequest.getPhoneNumber())
                .createdAt(Instant.now())
                .fullName(contactRequest.getFullName())
                .lastModified(Instant.now())
                .ownerUserName(securityUtils
                        .currentUsername()
                        .orElseThrow(() -> new IllegalArgumentException("Username is not present")))
                .pictureUrl(url)
                .isMuted(Boolean.FALSE)
                .build();
        contact = contactRepository.save(contact);
        return new ContactResponse(contact);
    }

    @Override
    public ContactResponse updateContact(ContactRequest contactData, String id) throws ContactNotFoundException, IOException {
        if (id == null || id.isEmpty()) {
            throw new IllegalArgumentException("Id can not be null");
        }

        Contact contact = contactRepository
                .findById(id)
                .orElseThrow(() -> new ContactNotFoundException("Contact not found"));

        String currentUserName = securityUtils
                .currentUsername()
                .orElseThrow(() -> new IllegalArgumentException("Username is not present"));

        if (!contact.getOwnerUserName().equals(currentUserName)) {
            throw new IllegalArgumentException("Data is not matching");
        }

        if (contactData.getEmail() != null
                && !contactData.getEmail().isBlank()) {
            contact.setEmail(contactData.getEmail());
        }
        if (contactData.getFullName() != null
                && !contactData.getFullName().isBlank()) {
            contact.setFullName(contactData.getFullName());
        }
        if (contactData.getPhoneNumber() != null
                && !contactData.getPhoneNumber().isBlank()) {
            contact.setPhoneNumber(contactData.getPhoneNumber());
        }

        if (contactData.getProfilePicture() != null && !contactData.getProfilePicture().isEmpty()) {
            String avatarUrl = getImageURL(contactData.getProfilePicture());
            contact.setPictureUrl(avatarUrl);
        } else if (contactData.getDeletePicture().equals(true)) {
            contact.setPictureUrl(null);
        }

        contact.setLastModified(Instant.now());

        contact = contactRepository.save(contact);

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
