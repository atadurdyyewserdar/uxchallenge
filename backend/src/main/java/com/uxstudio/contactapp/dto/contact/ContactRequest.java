package com.uxstudio.contactapp.dto.contact;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ContactRequest {
    @NotBlank(message = "Name is required", groups = OnCreate.class)
    @Size(min = 2, max = 50, message = "Name must be between 2 and 50 chars")
    private String fullName;

    // alloow optional leading + and separators (digits, spaces, dots, parentheses, hyphen)
    @Pattern(regexp = "^\\+?[0-9. ()-]{7,25}$", message = "Invalid phone number")
    private String phoneNumber;

    @NotBlank(message = "Email is required", groups = OnCreate.class)
    @Email(message = "Invalid email format")
    private String email;

    MultipartFile profilePicture;

    Boolean deletePicture;
}
