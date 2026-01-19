package com.uxstudio.contactapp.util;

import com.uxstudio.contactapp.dto.auth.RegisterRequest;
import com.uxstudio.contactapp.dto.auth.LoginRequest;
import com.uxstudio.contactapp.dto.contact.ContactRequest;

/**
 * Validator for request DTOs.
 * Validates incoming requests before processing in service layer.
 */
public class RequestValidator {

    /**
     * Validate register request has required fields.
     * @param request the register request to validate
     * @throws IllegalArgumentException if validation fails
     */
    public static void validateRegisterRequest(RegisterRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Register request cannot be null");
        }
        
        InputValidator.requireNonBlank(request.getUserName(), "Username cannot be empty");
        InputValidator.requireNonBlank(request.getPassword(), "Password cannot be empty");
        InputValidator.requireNonBlank(request.getEmail(), "Email cannot be empty");
    }

    /**
     * Validate login request has required fields.
     * @param request the login request to validate
     * @throws IllegalArgumentException if validation fails
     */
    public static void validateLoginRequest(LoginRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Login request cannot be null");
        }
        
        InputValidator.requireNonBlank(request.getUserName(), "Username cannot be empty");
        InputValidator.requireNonBlank(request.getPassword(), "Password cannot be empty");
    }

    /**
     * Validate contact request has at least one field to update.
     * @param request the contact request to validate
     * @throws IllegalArgumentException if validation fails
     */
    public static void validateContactRequest(ContactRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Contact request cannot be null");
        }
        
        // For create operation, fullName and phoneNumber should be present
        InputValidator.requireNonBlank(request.getFullName(), "Full name cannot be empty");
        InputValidator.requireNonBlank(request.getPhoneNumber(), "Phone number cannot be empty");
    }

    /**
     * Validate search parameter is not blank.
     * @param searchParam the search parameter
     * @throws IllegalArgumentException if blank
     */
    public static void validateSearchParam(String searchParam) {
        InputValidator.requireNonBlank(searchParam, "Search string cannot be empty");
    }

    /**
     * Validate contact ID is valid.
     * @param id the contact ID
     * @throws IllegalArgumentException if invalid
     */
    public static void validateContactId(String id) {
        InputValidator.requireValidId(id, "Contact ID cannot be null or empty");
    }
}
