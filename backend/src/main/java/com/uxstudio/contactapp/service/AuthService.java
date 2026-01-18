package com.uxstudio.contactapp.service;

import com.uxstudio.contactapp.dto.auth.RegisterRequest;
import com.uxstudio.contactapp.dto.auth.LoginRequest;
import com.uxstudio.contactapp.dto.auth.LoginResponse;
import com.uxstudio.contactapp.dto.auth.TokenResponse;
import com.uxstudio.contactapp.exception.UsernameAlreadyExistsException;
import com.uxstudio.contactapp.model.User;

public interface AuthService {
    LoginResponse login(LoginRequest loginRequest);

    User register(RegisterRequest registerRequest) throws UsernameAlreadyExistsException;

    TokenResponse generateRefreshToken(String refreshToken);
}
