package com.uxstudio.contactapp.dto.user;


import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UpdateUserDetailResponse {
    String id;
    String userName;
    String email;
    String fullName;
    Boolean isActive;
    Boolean isLocked;
}
