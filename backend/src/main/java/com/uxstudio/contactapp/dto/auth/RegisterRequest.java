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
    @Size(min = 4, max = 50, message = "Name must be between 2 and 20 chars")
    String userName;
    @NotBlank(message = "Password can not be empty")
    @Size(min=4, max = 100,  message = "Password should be between 4-100")
    String password;
    @Email
    String email;
    @NotBlank(message = "Name can not be empty")
    @Size(min=3, max=30, message = "Full name should be between 3-30")
    String fullName;
}
