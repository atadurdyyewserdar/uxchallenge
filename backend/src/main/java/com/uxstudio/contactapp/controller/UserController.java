package com.uxstudio.contactapp.controller;

import com.uxstudio.contactapp.dto.user.*;
import com.uxstudio.contactapp.exception.UserNotFoundException;
import com.uxstudio.contactapp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PutMapping("/update-user")
    public ResponseEntity<UpdateUserDetailResponse> updateUser(@Validated @ModelAttribute UpdateUserDetailRequest userDetailsRequest) throws UserNotFoundException {
        UpdateUserDetailResponse response = userService.updateUser(userDetailsRequest);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/update-profile")
    public ResponseEntity<ProfileResponse> updateProfile(@RequestBody UpdateProfileRequest userData, @RequestParam String userName) {
        ProfileResponse response = userService.updateProfile(userData, userName);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/get-user")
    public ResponseEntity<UserDetail> getUserByContext() throws UserNotFoundException {
        UserDetail response = userService.getUserByContect();
        return ResponseEntity.ok(response);
    }
}
