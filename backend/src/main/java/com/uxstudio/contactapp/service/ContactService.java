package com.uxstudio.contactapp.service;

import com.uxstudio.contactapp.dto.contact.ContactRequest;
import com.uxstudio.contactapp.dto.contact.ContactResponse;
import com.uxstudio.contactapp.exception.ContactNotDeleted;
import com.uxstudio.contactapp.exception.ContactNotFoundException;
import com.uxstudio.contactapp.exception.UserNotFoundException;

import java.io.IOException;
import java.util.List;

public interface ContactService {
    List<ContactResponse> getContactsByOwner();

    ContactResponse createContact(ContactRequest contactData) throws IOException;

    ContactResponse updateContact(ContactRequest contactData, String id) throws ContactNotFoundException, IOException;

    void deleteMyContact(String id) throws ContactNotFoundException, ContactNotDeleted;

    ContactResponse toggleMuteContact(String id) throws ContactNotFoundException;

    List<ContactResponse> findByFullNameContainingOrPhoneNumberContaining(String param) throws UserNotFoundException;
}
