package com.uxstudio.contactapp.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class TokenResponse {
    String accessToken;
    String refreshToken;
}
