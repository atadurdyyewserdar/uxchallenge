package com.uxstudio.contactapp.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {
    @NotBlank(message = "Username is required")
    @Size(min = 4, max = 50, message = "Username must be between 4 and 50 characters")
    String userName;

    @NotBlank(message = "Password can not be empty")
    @Size(min = 4, max = 100,  message = "Password should be between 4 and 100 characters")
    String password;

    @Email(message = "Invalid email format")
    String email;

    @NotBlank(message = "Full name is required")
    @Size(min = 1, max = 50, message = "Full name must be between 1 and 50 characters")
    String fullName;
}
