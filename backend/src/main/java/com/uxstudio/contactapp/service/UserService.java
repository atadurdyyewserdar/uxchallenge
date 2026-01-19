package com.uxstudio.contactapp.service;

import com.uxstudio.contactapp.dto.user.*;
import com.uxstudio.contactapp.exception.UserNotFoundException;
import com.uxstudio.contactapp.model.User;

public interface UserService {
    User getUserByUserName(String userName);

    User saveUser(User user);

    UpdateUserDetailResponse updateUser(UpdateUserDetailRequest userDetailsRequest) throws UserNotFoundException;

    ProfileResponse updateProfile(UpdateProfileRequest userData, String userName);

    boolean isUserExist(String userName);

    UserDetail getUserByContect() throws UserNotFoundException;
}
