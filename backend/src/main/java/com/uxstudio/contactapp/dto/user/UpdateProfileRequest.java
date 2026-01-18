package com.uxstudio.contactapp.dto.user;

import lombok.Data;

@Data
public class UpdateProfileRequest {
    String userName;
    String password;
    String email;
    String fullName;
}
