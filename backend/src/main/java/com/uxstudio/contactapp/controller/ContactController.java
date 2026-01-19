package com.uxstudio.contactapp.controller;

import com.uxstudio.contactapp.constants.HTTPConstants;
import com.uxstudio.contactapp.dto.common.EmptyResponse;
import com.uxstudio.contactapp.dto.contact.ContactRequest;
import com.uxstudio.contactapp.dto.contact.ContactResponse;
import com.uxstudio.contactapp.dto.contact.OnCreate;
import com.uxstudio.contactapp.dto.contact.OnUpdate;
import com.uxstudio.contactapp.exception.ContactNotDeleted;
import com.uxstudio.contactapp.exception.ContactNotFoundException;
import com.uxstudio.contactapp.exception.UserNotFoundException;
import com.uxstudio.contactapp.service.ContactService;
import jakarta.validation.Valid;
import jakarta.validation.groups.Default;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/contacts")
public class ContactController {
    private final ContactService contactService;

    public ContactController(ContactService contactService) {
        this.contactService = contactService;
    }

    @PostMapping(value = "/add-contact", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ContactResponse> createContact(@Validated({OnCreate.class, Default.class}) @ModelAttribute ContactRequest contactRequest) throws IOException {
        ContactResponse response = contactService.createContact(contactRequest);
        return ResponseEntity.ok(response);
    }

    @PutMapping(value = "/update/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ContactResponse> updateContact(@Validated({OnUpdate.class, Default.class}) @ModelAttribute ContactRequest contactRequest, @PathVariable String id) throws ContactNotFoundException, IOException {
        ContactResponse contactResponse = contactService.updateContact(contactRequest, id);
        return ResponseEntity.ok(contactResponse);
    }

    @DeleteMapping("/delete-my-contact/{id}")
    public ResponseEntity<EmptyResponse> deleteMyContact(@PathVariable String id) throws ContactNotFoundException, ContactNotDeleted {
        contactService.deleteMyContact(id);
        return ResponseEntity.ok(new EmptyResponse(HTTPConstants.SUCCESS_TEXT));
    }

    @GetMapping("/get-all-contacts/my")
    public ResponseEntity<List<ContactResponse>> getAllMyContacts(@RequestParam(required = false) String param) throws UserNotFoundException {
        if (param!= null && !param.trim().isEmpty()) {
            return ResponseEntity.ok(contactService.findByFullNameContainingOrPhoneNumberContaining(param));
        }
        return ResponseEntity.ok(contactService.getContactsByOwner());
    }

    @PutMapping("/update/toggle-mute/{id}")
    public ResponseEntity<ContactResponse> muteContact(@PathVariable String id) throws ContactNotFoundException {
        ContactResponse contacts = contactService.toggleMuteContact(id);
        return ResponseEntity.ok(contacts);
    }
}
