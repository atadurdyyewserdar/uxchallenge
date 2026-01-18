package com.uxstudio.contactapp.dto.user;

import lombok.Data;

@Data
public class UserAddRequest {
    String email;
    String userName;
    String password;
    String fullName;
    String avatarUrl;
}


