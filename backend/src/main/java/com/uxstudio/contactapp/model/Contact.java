package com.uxstudio.contactapp.model;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "contacts")
@Getter
@Setter
@Builder
public class Contact {
    @Id
    String id;
    String ownerUserName;
    String fullName;
    String phoneNumber;
    String email;
    @CreatedDate
    Instant createdAt;
    @LastModifiedDate
    Instant lastModified;
    String pictureUrl;
    Boolean isMuted;
}
