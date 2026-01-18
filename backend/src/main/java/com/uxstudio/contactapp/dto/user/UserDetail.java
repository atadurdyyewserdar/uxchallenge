package com.uxstudio.contactapp.dto.user;

import com.uxstudio.contactapp.model.Role;
import com.uxstudio.contactapp.model.User;
import lombok.Data;

import java.time.Instant;
import java.util.Set;

@Data
public class UserDetail {
    String id;
    String email;
    String userName;
    String fullName;
    String avatarUrl;
    Set<Role> roles;
    Boolean isActive;
    Boolean isLocked;
    Instant createdAt;
    Instant lastModified;

    public UserDetail(User user) {
        this.id = user.getId();
        this.email = user.getEmail();
        this.userName = user.getUserName();
        this.fullName = user.getFullName();
        this.avatarUrl = user.getAvatarUrl();
        this.roles = user.getRoles();
        this.isActive = user.isActive();
        this.isLocked = user.isLocked();
        this.createdAt = user.getCreatedAt();
        this.lastModified = user.getUpdatedAt();
    }
}
