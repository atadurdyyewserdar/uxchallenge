package com.uxstudio.contactapp.service.impl;

import com.uxstudio.contactapp.dto.contact.ContactRequest;
import com.uxstudio.contactapp.dto.contact.ContactResponse;
import com.uxstudio.contactapp.exception.ContactNotDeleted;
import com.uxstudio.contactapp.model.Contact;
import com.uxstudio.contactapp.repository.ContactRepository;
import com.uxstudio.contactapp.service.AmazonS3Service;
import com.uxstudio.contactapp.util.SecurityUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.mongodb.core.MongoTemplate;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ContactServiceImplTest {

    private static final String TEST_USER = "serdar";
    private static final String TEST_PHONE = "+36012345678";
    private static final String CONTACT_ID = "123";
    private static final String CONTACT_ID_MUTE = "42";
    private static final String CONTACT_ID_LIST = "1";
    private static final String CONTACT_NAME = "John Doe";
    private static final String CONTACT_NAME_CREATE = "Serdar";
    private static final String GENERATED_ID = "generatedId";
    private static final String MISSING_CONTACT = "missing";

    @Mock
    private ContactRepository contactRepository;

    @Mock
    private SecurityUtils securityUtils;

    @Mock
    private AmazonS3Service amazonS3Service;

    @Mock
    private MongoTemplate mongoTemplate;

    @InjectMocks
    private ContactServiceImpl contactService;

    @BeforeEach
    void setUp() {
        when(securityUtils.currentUsername()).thenReturn(Optional.of(TEST_USER));
    }

    private Contact createTestContact(String id, String name) {
        return Contact.builder()
                .id(id)
                .ownerUserName(TEST_USER)
                .fullName(name)
                .isMuted(false)
                .build();
    }

    private ContactRequest createContactRequest() {
        ContactRequest req = new ContactRequest();
        req.setFullName(ContactServiceImplTest.CONTACT_NAME_CREATE);
        req.setPhoneNumber(ContactServiceImplTest.TEST_PHONE);
        return req;
    }

    @Test
    void deleteMyContact_deletesWhenOwnerMatches() throws Exception {
        when(contactRepository.deleteContactByIdAndOwnerUserName(CONTACT_ID, TEST_USER)).thenReturn(1L);

        contactService.deleteMyContact(CONTACT_ID);

        verify(contactRepository).deleteContactByIdAndOwnerUserName(CONTACT_ID, TEST_USER);
    }

    @Test
    void deleteMyContact_throwsWhenNothingDeleted() {
        when(contactRepository.deleteContactByIdAndOwnerUserName(MISSING_CONTACT, TEST_USER)).thenReturn(0L);

        assertThrows(ContactNotDeleted.class, () -> contactService.deleteMyContact(MISSING_CONTACT));
    }

    @Test
    void toggleMuteContact_flipsFlagAndPersists() throws Exception {
        Contact contact = createTestContact(CONTACT_ID_MUTE, CONTACT_NAME);
        
        when(contactRepository.findContactByIdAndOwnerUserName(CONTACT_ID_MUTE, TEST_USER)).thenReturn(Optional.of(contact));
        when(contactRepository.save(any(Contact.class))).thenAnswer(inv -> inv.getArgument(0));

        ContactResponse response = contactService.toggleMuteContact(CONTACT_ID_MUTE);

        assertThat(response.getIsMuted()).isTrue();
        verify(contactRepository).save(any(Contact.class));
    }

    @Test
    void getContactsByOwner_returnsList() {
        Contact contact = createTestContact(CONTACT_ID_LIST, CONTACT_NAME);
        when(contactRepository.findContactsByOwnerUserName(TEST_USER)).thenReturn(List.of(contact));

        var result = contactService.getContactsByOwner();

        assertThat(result).hasSize(1);
        assertThat(result.getFirst().getFullName()).isEqualTo(CONTACT_NAME);
    }

    @Test
    void getContactsByOwner_throwsWhenUserNotPresent() {
        when(securityUtils.currentUsername()).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> contactService.getContactsByOwner());
    }

    @Test
    void createContact_savesContact() throws Exception {
        ContactRequest req = createContactRequest();
        
        when(contactRepository.save(any(Contact.class))).thenAnswer(inv -> {
            Contact c = inv.getArgument(0);
            c.setId(GENERATED_ID);
            return c;
        });

        ContactResponse res = contactService.createContact(req);

        assertThat(res.getFullName()).isEqualTo(CONTACT_NAME_CREATE);
        assertThat(res.getId()).isEqualTo(GENERATED_ID);
    }
}
