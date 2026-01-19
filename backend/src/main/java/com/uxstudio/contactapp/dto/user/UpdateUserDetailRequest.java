package com.uxstudio.contactapp.dto.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UpdateUserDetailRequest {

    @Email(message = "Invalid email format")
    String email;

    @Size(min = 4, max = 50, message = "Username must be between 4 and 50 characters")
    String userName;

    // Password is optional on update; when provided it must be between 4 and 50 chars
    @Size(min = 4, max = 50, message = "Password must be between 4 and 50 characters")
    String password;

    @Size(min = 1, max = 50, message = "Full name must be between 1 and 50 characters")
    String fullName;
    Boolean isActive;
    Boolean isLocked;
}
