package com.uxstudio.contactapp.dto.user;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ProfileResponse {
    String id;
    String email;
    String userName;
    String password;
    String fullName;
}
