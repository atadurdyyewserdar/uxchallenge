package com.uxstudio.contactapp.dto.contact;

import com.uxstudio.contactapp.model.Contact;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.Instant;

@Data
@AllArgsConstructor
public class ContactResponse {
    String id;
    String ownerUserName;
    String fullName;
    String phoneNumber;
    String email;
    Instant createdAt;
    Instant lastModified;
    String pictureUrl;
    Boolean isMuted;

    public ContactResponse(Contact contact) {
        this.id = contact.getId();
        this.ownerUserName = contact.getOwnerUserName();
        this.fullName = contact.getFullName();
        this.phoneNumber = contact.getPhoneNumber();
        this.email = contact.getEmail();
        this.createdAt = contact.getCreatedAt();
        this.lastModified = contact.getLastModified();
        this.pictureUrl = contact.getPictureUrl();
        this.isMuted = contact.getIsMuted();
    }
}
