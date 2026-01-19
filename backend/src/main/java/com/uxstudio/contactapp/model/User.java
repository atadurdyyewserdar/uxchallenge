package com.uxstudio.contactapp.model;

import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.Set;

@Document(collection = "users")
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class User {
    @Id
    private String id;
    @Indexed(unique = true)
    private String email;
    @Indexed(unique = true)
    private String userName;
    private String password;
    // TODO Seperate name and lastname
    private String fullName;
    private String avatarUrl;
    @CreatedDate
    private Instant createdAt;
    @LastModifiedDate
    private Instant updatedAt;
    private Set<Role> roles;
    private boolean isActive;
    private boolean isLocked;
}
