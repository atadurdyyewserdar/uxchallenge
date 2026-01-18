package com.uxstudio.contactapp.dto.user;

import com.uxstudio.contactapp.dto.contact.OnCreate;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UpdateUserDetailRequest {

    @Email
    @NotBlank(message = "Email is required", groups = OnCreate.class)
    String email;
    @NotBlank(message = "Name is required", groups = OnCreate.class)
    @Size(min = 4, max = 50, message = "Name must be between 4 and 50 chars")
    String userName;

    @NotBlank(message = "Name is required", groups = OnCreate.class)
    @Size(min = 4, max = 50, message = "Name must be between 4 and 50 chars")
    String password;

    @NotBlank(message = "Name is required", groups = OnCreate.class)
    @Size(min = 1, max = 50, message = "Name must be between 1 and 50 chars")
    String fullName;
    Boolean isActive;
    Boolean isLocked;
}
