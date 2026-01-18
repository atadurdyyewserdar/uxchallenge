package com.uxstudio.contactapp.dto.auth;

import com.uxstudio.contactapp.model.Role;
import com.uxstudio.contactapp.model.User;
import lombok.Data;

import java.util.Set;

@Data
public class LoginResponse {
    String id;
    String email;
    String userName;
    String avatarUrl;
    Set<Role> roles;
    String fullName;
    String accessToken;
    String refreshToken;


    public LoginResponse(User user, String accessToken, String refreshToken) {
        this.id = user.getId();
        this.email = user.getEmail();
        this.userName = user.getUserName();
        this.avatarUrl = user.getAvatarUrl();
        this.roles = user.getRoles();
        this.fullName = user.getFullName();
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
    }
}
