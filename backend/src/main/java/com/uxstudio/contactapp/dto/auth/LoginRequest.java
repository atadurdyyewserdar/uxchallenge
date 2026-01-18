package com.uxstudio.contactapp.dto.auth;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class LoginRequest {
    @NotBlank(message = "Username is required")
    @Size(min = 2, max = 20, message = "Name must be between 2 and 20 chars")
    String userName;
    String password;
}
