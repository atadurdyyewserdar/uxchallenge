package com.uxstudio.contactapp.service.impl;

import com.uxstudio.contactapp.dto.user.*;
import com.uxstudio.contactapp.exception.UserNotFoundException;
import com.uxstudio.contactapp.model.User;
import com.uxstudio.contactapp.repository.UserRepository;
import com.uxstudio.contactapp.service.UserService;
import com.uxstudio.contactapp.util.SecurityUtils;
import com.uxstudio.contactapp.util.InputValidator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.*;

@Service
public class UserServiceImpl implements UserService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder encoder;
    private final Logger LOGGER = LoggerFactory.getLogger(getClass());
    private final SecurityUtils securityUtils;

    @Autowired
    public UserServiceImpl(UserRepository userRepository, PasswordEncoder encoder, SecurityUtils securityUtils) {
        this.userRepository = userRepository;
        this.encoder = encoder;
        this.securityUtils = securityUtils;
    }

    @Override
    public User getUserByUserName(String userName) {
        return userRepository.findByUserName(userName)
                .orElseThrow(() -> {
                    LOGGER.warn("User with {} not found", userName);
                    return new UsernameNotFoundException("User not found");
                });
    }

    @Override
    public User saveUser(User user) {
        LOGGER.info("Saving user: {}", user.getUserName());
        return userRepository.save(user);
    }

    @Override
    public UpdateUserDetailResponse updateUser(UpdateUserDetailRequest userData) throws UserNotFoundException {
        String currentUser = securityUtils.currentUsername()
                .orElseThrow(() -> new UserNotFoundException("Something went wrong"));

        User user = getUserByUserName(currentUser);

        // Update fields only if provided and not blank
        if (InputValidator.shouldUpdate(userData.getEmail())) {
            LOGGER.debug("Updating email for user: {}", currentUser);
            user.setEmail(userData.getEmail());
        }
        if (InputValidator.shouldUpdate(userData.getFullName())) {
            LOGGER.debug("Updating full name for user: {}", currentUser);
            user.setFullName(userData.getFullName());
        }
        if (InputValidator.shouldUpdate(userData.getUserName())) {
            LOGGER.debug("Updating username from {} to {}", currentUser, userData.getUserName());
            user.setUserName(userData.getUserName());
        }
        if (InputValidator.shouldUpdate(userData.getPassword())) {
            LOGGER.debug("Updating password for user: {}", currentUser);
            user.setPassword(encoder.encode(userData.getPassword()));
        }
        if (userData.getIsActive() != null) {
            LOGGER.debug("Updating active status for user: {} to {}", currentUser, userData.getIsActive());
            user.setActive(userData.getIsActive());
        }
        if (userData.getIsLocked() != null) {
            LOGGER.debug("Updating locked status for user: {} to {}", currentUser, userData.getIsLocked());
            user.setLocked(userData.getIsLocked());
        }
        
        user.setUpdatedAt(Instant.now());

        User savedUser = userRepository.save(user);
        LOGGER.info("User details updated successfully: {}", currentUser);

        return new UpdateUserDetailResponse(savedUser.getId(), savedUser.getUserName(), savedUser.getEmail(), 
                savedUser.getFullName(), savedUser.isActive(), savedUser.isLocked());
    }

    @Override
    public ProfileResponse updateProfile(UpdateProfileRequest userData, String userName) {
        User user = getUserByUserName(userName);

        // Update fields only if provided and not blank
        if (InputValidator.shouldUpdate(userData.getEmail())) {
            LOGGER.debug("Updating email for user: {}", userName);
            user.setEmail(userData.getEmail());
        }
        if (InputValidator.shouldUpdate(userData.getFullName())) {
            LOGGER.debug("Updating full name for user: {}", userName);
            user.setFullName(userData.getFullName());
        }
        if (InputValidator.shouldUpdate(userData.getUserName())) {
            LOGGER.debug("Updating username from {} to {}", userName, userData.getUserName());
            user.setUserName(userData.getUserName());
        }
        if (InputValidator.shouldUpdate(userData.getPassword())) {
            LOGGER.debug("Updating password for user: {}", userName);
            user.setPassword(encoder.encode(userData.getPassword()));
        }

        user.setUpdatedAt(Instant.now());

        User savedUser = userRepository.save(user);
        LOGGER.info("Profile updated successfully, username: {}", userName);

        return new ProfileResponse(savedUser.getId(), savedUser.getUserName(), savedUser.getPassword(), 
                savedUser.getEmail(), savedUser.getFullName());
    }

    @Override
    public boolean isUserExist(String userName) {
        // check if user exists
        Optional<User> user = userRepository.findByUserName(userName);
        boolean exists = user.isPresent();
        return exists;
    }

    @Override
    public UserDetail getUserByContect() throws UserNotFoundException {
        String userName = securityUtils.currentUsername()
                .orElseThrow(() -> {
                    LOGGER.warn("Failed to get current user - no authentication context");
                    return new UserNotFoundException("Something went wrong");
                });
        
        User user = getUserByUserName(userName);
        LOGGER.info("User details retrieved for: {}", userName);
        return new UserDetail(user);
    }
}
