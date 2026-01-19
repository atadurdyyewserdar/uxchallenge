package com.uxstudio.contactapp.service.impl;

import com.uxstudio.contactapp.model.User;
import com.uxstudio.contactapp.model.UserPrincipal;
import com.uxstudio.contactapp.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {
    private final UserRepository userRepository;
    private final Logger LOGGER = LoggerFactory.getLogger(getClass());

    @Autowired
    public UserDetailsServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUserName(username)
                .orElseThrow(() -> {
                    LOGGER.warn("User not found for authentication: {}", username);
                    return new UsernameNotFoundException("User not found: " + username);
                });
        LOGGER.debug("User details loaded successfully: {}", username);
        return new UserPrincipal(user);
    }
}
