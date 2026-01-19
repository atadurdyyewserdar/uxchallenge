package com.uxstudio.contactapp.service.impl;

import com.uxstudio.contactapp.dto.auth.RegisterRequest;
import com.uxstudio.contactapp.dto.auth.LoginRequest;
import com.uxstudio.contactapp.dto.auth.LoginResponse;
import com.uxstudio.contactapp.dto.auth.TokenResponse;
import com.uxstudio.contactapp.exception.UsernameAlreadyExistsException;
import com.uxstudio.contactapp.constants.ExceptionConstants;
import com.uxstudio.contactapp.model.Role;
import com.uxstudio.contactapp.model.User;
import com.uxstudio.contactapp.service.AuthService;
import com.uxstudio.contactapp.service.UserService;
import com.uxstudio.contactapp.util.JWTProvider;
import com.uxstudio.contactapp.util.RequestValidator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Set;

@Service
public class AuthServiceImpl implements AuthService {
    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final JWTProvider jwtProvider;
    private final PasswordEncoder encoder;
    private final Logger LOGGER = LoggerFactory.getLogger(getClass());

    @Autowired
    public AuthServiceImpl(UserService userService,
                           AuthenticationManager authenticationManager,
                           JWTProvider jwtProvider,
                           PasswordEncoder encoder
    ) {
        this.userService = userService;
        this.authenticationManager = authenticationManager;
        this.jwtProvider = jwtProvider;
        this.encoder = encoder;
    }

    @Override
    public LoginResponse login(LoginRequest loginRequest) {
        try {
            Authentication auth = authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(loginRequest.getUserName(), loginRequest.getPassword())
            );
            String accessToken = jwtProvider.generateAccessToken(auth.getName());
            String refreshToken = jwtProvider.generateRefreshToken(loginRequest.getUserName());
            User user = userService.getUserByUserName(loginRequest.getUserName());
            
            LOGGER.info("User logged in successfully: {}", loginRequest.getUserName());
            return new LoginResponse(user, accessToken, refreshToken);
        } catch (Exception ex) {
            LOGGER.warn("Login failed for user: {} - {}", loginRequest.getUserName(), ex.getMessage());
            throw ex;
        }
    }

    @Override
    public User register(RegisterRequest registerRequest) throws UsernameAlreadyExistsException {
        RequestValidator.validateRegisterRequest(registerRequest);
        
        if (userService.isUserExist(registerRequest.getUserName())) {
            LOGGER.warn("Registration fail, username already exists - {}", registerRequest.getUserName());
            throw new UsernameAlreadyExistsException(ExceptionConstants.USERNAME_ALREADY_EXISTS);
        }
        
        User user = User.builder()
                .userName(registerRequest.getUserName())
                .password(encoder.encode(registerRequest.getPassword()))
                .email(registerRequest.getEmail())
                .fullName(registerRequest.getFullName())
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .isActive(true)
                .isLocked(false)
                .roles(Set.of(Role.ROLE_ADMIN))
                .build();

        User savedUser = userService.saveUser(user);
        LOGGER.info("User registered successfully: {}", registerRequest.getUserName());
        return savedUser;
    }

    @Override
    public TokenResponse generateRefreshToken(String refreshToken) {
        try {
            String userName = jwtProvider.validateAndExtractUsernameFromRefreshToken(refreshToken);
            String newAccessToken = jwtProvider.generateAccessToken(userName);
            String newRefreshToken = jwtProvider.generateRefreshToken(userName);
            
            LOGGER.info("Tokens refreshed successfull for user: {}", userName);
            return new TokenResponse(newAccessToken, newRefreshToken);
        } catch (Exception ex) {
            LOGGER.warn("Token refresh failed: {}", ex.getMessage());
            throw ex;
        }
    }
}
