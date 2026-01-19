package com.uxstudio.contactapp.exception;

import com.uxstudio.contactapp.dto.records.ErrorResponse;
import com.uxstudio.contactapp.constants.ExceptionConstants;
import jakarta.servlet.http.HttpServletRequest;
import org.apache.coyote.BadRequestException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.ServletWebRequest;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.time.Clock;
import java.time.Instant;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;


@RestControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    private final Clock clock;
    private final Logger LOGGER = LoggerFactory.getLogger(getClass());

    public GlobalExceptionHandler() {
        this.clock = Clock.systemUTC();
    }

    public GlobalExceptionHandler(Clock clock) {
        this.clock = (clock == null) ? Clock.systemUTC() : clock;
    }

    private ErrorResponse toErrorResponse(int status, String message, HttpServletRequest request) {
        var path = (request != null) ? request.getRequestURI() : "";
        return new ErrorResponse(Instant.now(clock), status, message, path);
    }

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleUserNotFound(UserNotFoundException ex, HttpServletRequest request) {
        LOGGER.warn(ex.getMessage());
        var body = toErrorResponse(HttpStatus.NOT_FOUND.value(), "Not Found", request);
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(body);
    }

    @ExceptionHandler(ContactNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleContactNotFound(ContactNotFoundException ex, HttpServletRequest request) {
        LOGGER.warn(ex.getMessage());
        var body = toErrorResponse(HttpStatus.NOT_FOUND.value(), "Not Found", request);
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(body);
    }

    @ExceptionHandler(UsernameAlreadyExistsException.class)
    public ResponseEntity<ErrorResponse> handleUsernameAlreadyExists(UsernameAlreadyExistsException ex, HttpServletRequest request) {
        LOGGER.warn(ex.getMessage());
        var body = toErrorResponse(HttpStatus.CONFLICT.value(), ExceptionConstants.USERNAME_ALREADY_EXISTS, request);
        return ResponseEntity.status(HttpStatus.CONFLICT).body(body);
    }

    @ExceptionHandler(ContactNotDeleted.class)
    public ResponseEntity<ErrorResponse> handleContactNotDeleted(ContactNotDeleted ex, HttpServletRequest request) {
        LOGGER.error(ex.getMessage());
        var body = toErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Contact Deletion Failed", request);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(body);
    }

    @ExceptionHandler({IllegalArgumentException.class, BadRequestException.class})
    public ResponseEntity<ErrorResponse> handleBadRequest(RuntimeException ex, HttpServletRequest request) {
        LOGGER.warn(ex.getMessage());
        var body = toErrorResponse(HttpStatus.BAD_REQUEST.value(), ex.getMessage(), request);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleAll(Exception ex, HttpServletRequest request) {
        LOGGER.error(ex.getMessage());
        var body = toErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Internal Server Error", request);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(body);
    }

    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(
            MethodArgumentNotValidException ex,
            HttpHeaders headers,
            HttpStatusCode status,
            WebRequest request
    ) {
        // Map to hold Field -> Error Message
        Map<String, String> validationErrors = new HashMap<>();

        // Loop through all errors and populate the map
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            validationErrors.put(fieldName, errorMessage);
        });

        // Formatted Error Response
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("status", status.value());
        body.put("message", "Validation failed");
        body.put("errors", validationErrors);
        body.put("path", ((ServletWebRequest) request).getRequest().getRequestURI());

        return ResponseEntity.status(status).headers(headers).body(body);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ErrorResponse> handleBadCredentials(BadCredentialsException ex, HttpServletRequest request) {
        LOGGER.warn(ex.getMessage());
        var body = toErrorResponse(HttpStatus.UNAUTHORIZED.value(), ExceptionConstants.INCORRECT_CREDENTIALS, request);
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(body);
    }
}
