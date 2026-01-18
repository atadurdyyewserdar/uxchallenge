package com.uxstudio.contactapp.controller;

import com.uxstudio.contactapp.dto.auth.RegisterRequest;
import com.uxstudio.contactapp.dto.auth.LoginRequest;
import com.uxstudio.contactapp.dto.auth.LoginResponse;
import com.uxstudio.contactapp.dto.auth.TokenResponse;
import com.uxstudio.contactapp.exception.UsernameAlreadyExistsException;
import com.uxstudio.contactapp.model.User;
import com.uxstudio.contactapp.service.AuthService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final Logger LOGGER = LoggerFactory.getLogger(getClass());

    @Autowired
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse>login(@RequestBody LoginRequest loginRequest) {
        LoginResponse response = authService.login(loginRequest);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody RegisterRequest registerRequest) throws UsernameAlreadyExistsException {
        User user = authService.register(registerRequest);
        return ResponseEntity.ok(user);
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<TokenResponse>refreshToken(@RequestParam String refreshToken) {
        return ResponseEntity.ok(authService.generateRefreshToken(refreshToken));
    }
}
