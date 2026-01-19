package com.uxstudio.contactapp.util;

public class InputValidator {

    // check if string is null, empty, or contains only whitespace.
    public static boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }

    // require string to be non-blank
    public static void requireNonBlank(String value, String message) {
        if (isBlank(value)) {
            throw new IllegalArgumentException(message);
        }
    }

    // check if id is valid
    public static boolean isValidId(String id) {
        return id != null && !id.isEmpty();
    }

    // require id to be valid
    public static void requireValidId(String id, String message) {
        if (!isValidId(id)) {
            throw new IllegalArgumentException(message);
        }
    }

    // validate that a string field should be updated (not null and not blank).
    public static boolean shouldUpdate(String value) {
        return value != null && !value.isBlank();
    }
}
