package com.uxstudio.contactapp.service.impl;

import com.uxstudio.contactapp.dto.user.*;
import com.uxstudio.contactapp.exception.UserNotFoundException;
import com.uxstudio.contactapp.model.Role;
import com.uxstudio.contactapp.model.User;
import com.uxstudio.contactapp.repository.UserRepository;
import com.uxstudio.contactapp.service.UserService;
import com.uxstudio.contactapp.util.SecurityUtils;
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
        return userRepository.findByUserName(userName).orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    @Override
    public User saveUser(User user) {
        return userRepository.save(user);
    }

    @Override
    public UpdateUserDetailResponse updateUser(UpdateUserDetailRequest userData) throws UserNotFoundException {
        LOGGER.info(String.valueOf(userData));

        String currentUser = securityUtils.currentUsername().orElseThrow(() -> new UserNotFoundException("Something went wrong"));

        User user = getUserByUserName(currentUser);

        if (userData.getEmail() != null && !userData.getEmail().isBlank()) {
            user.setEmail(userData.getEmail());
        }
        if (userData.getFullName() != null && !userData.getFullName().isBlank()) {
            user.setFullName(userData.getFullName());
        }
        if (userData.getUserName() != null && !userData.getUserName().isBlank()) {
            user.setUserName(userData.getUserName());
        }
        if (userData.getPassword() != null && !userData.getPassword().isBlank()) {
            user.setPassword(encoder.encode(userData.getPassword()));
        }
        if (userData.getIsActive() != null) {
            user.setActive(userData.getIsActive());
        }
        if (userData.getIsLocked() != null) {
            user.setLocked(userData.getIsLocked());
        }

        LOGGER.info(String.valueOf(userData.getIsActive()));
        LOGGER.info(String.valueOf(userData.getIsLocked()));

        user.setUpdatedAt(Instant.now());

        User savedUser = userRepository.save(user);

        return new UpdateUserDetailResponse(savedUser.getId(), savedUser.getUserName(), savedUser.getEmail(), savedUser.getFullName(), savedUser.isActive(), savedUser.isLocked());
    }

    @Override
    public ProfileResponse updateProfile(UpdateProfileRequest userData, String userName) {
        User user = getUserByUserName(userName);

        if (userData.getEmail() != null && !userData.getEmail().isBlank()) {
            user.setEmail(userData.getEmail());
        }
        if (userData.getFullName() != null && !userData.getFullName().isBlank()) {
            user.setFullName(userData.getFullName());
        }
        if (userData.getUserName() != null && !userData.getUserName().isBlank()) {
            user.setUserName(userData.getUserName());
        }
        if (userData.getPassword() != null && !userData.getPassword().isBlank()) {
            user.setPassword(encoder.encode(userData.getPassword()));
        }

        user.setUpdatedAt(Instant.now());

        User savedUser = userRepository.save(user);

        return new ProfileResponse(savedUser.getId(), savedUser.getUserName(), savedUser.getPassword(), savedUser.getEmail(), savedUser.getFullName());
    }

    @Override
    public boolean isUserExist(String userName) {
        Optional<User> user = userRepository.findByUserName(userName);
        return user.isPresent();
    }

    @Override
    public UserDetail getUserByContect() throws UserNotFoundException {
        String userName = securityUtils.currentUsername().orElseThrow(() -> new UserNotFoundException("Something went wrong"));
        User user = getUserByUserName(userName);
        return new UserDetail(user);
    }
}
