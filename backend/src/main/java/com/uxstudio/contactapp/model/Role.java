package com.uxstudio.contactapp.model;

public enum Role {
    ROLE_SUPER_ADMIN,
    ROLE_ADMIN,
    ROLE_USER;

    String getValue() {
        return this.name();
    }
}
