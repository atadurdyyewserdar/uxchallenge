package com.uxstudio.contactapp.service.impl;

import com.uxstudio.contactapp.dto.auth.LoginRequest;
import com.uxstudio.contactapp.dto.auth.RegisterRequest;
import com.uxstudio.contactapp.exception.UsernameAlreadyExistsException;
import com.uxstudio.contactapp.model.User;
import com.uxstudio.contactapp.service.UserService;
import com.uxstudio.contactapp.util.JWTProvider;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceImplTest {

    private static final String TEST_USERNAME = "serdar";
    private static final String TEST_PASSWORD = "s3cret";
    private static final String ENCODED_PASSWORD = "encoded_s3cret";
    private static final String ACCESS_TOKEN = "access.token";
    private static final String REFRESH_TOKEN = "refresh.token";
    private static final String TEST_EMAIL = "serdar@example.com";
    private static final String TEST_PHONE = "+36012345678";

    @Mock
    private UserService userService;
    @Mock
    private AuthenticationManager authenticationManager;
    @Mock
    private JWTProvider jwtProvider;
    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private AuthServiceImpl authService;

    private RegisterRequest createRegisterRequest() {
        RegisterRequest req = new RegisterRequest();
        req.setUserName(AuthServiceImplTest.TEST_USERNAME);
        req.setPassword(AuthServiceImplTest.TEST_PASSWORD);
        req.setEmail(TEST_EMAIL);
        return req;
    }

    private LoginRequest createLoginRequest() {
        LoginRequest req = new LoginRequest();
        req.setUserName(AuthServiceImplTest.TEST_USERNAME);
        req.setPassword("pass");
        return req;
    }

    @Test
    void register_savesNewUser_whenUsernameAvailable() throws UsernameAlreadyExistsException {
        RegisterRequest req = createRegisterRequest();

        when(userService.isUserExist(TEST_USERNAME)).thenReturn(false);
        when(passwordEncoder.encode(TEST_PASSWORD)).thenReturn(ENCODED_PASSWORD);
        when(userService.saveUser(any(User.class))).thenAnswer(inv -> inv.getArgument(0));

        User result = authService.register(req);

        assertThat(result.getUserName()).isEqualTo(TEST_USERNAME);
        assertThat(result.getPassword()).isEqualTo(ENCODED_PASSWORD);
        verify(userService).saveUser(any(User.class));
    }

    @Test
    void register_throws_whenUserExists() {
        RegisterRequest req = createRegisterRequest();

        when(userService.isUserExist(TEST_USERNAME)).thenReturn(true);

        assertThrows(UsernameAlreadyExistsException.class, () -> authService.register(req));
        verify(userService, never()).saveUser(any());
    }

    @Test
    void login_returnsToken_whenCredentialsValid() {
        LoginRequest req = createLoginRequest();
        
        Authentication auth = mock(Authentication.class);
        when(auth.getName()).thenReturn(TEST_USERNAME);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(auth);
        when(jwtProvider.generateAccessToken(TEST_USERNAME)).thenReturn(ACCESS_TOKEN);
        when(jwtProvider.generateRefreshToken(TEST_USERNAME)).thenReturn(REFRESH_TOKEN);
        when(userService.getUserByUserName(TEST_USERNAME)).thenReturn(new User());

        var response = authService.login(req);

        assertThat(response.getAccessToken()).isEqualTo(ACCESS_TOKEN);
        assertThat(response.getRefreshToken()).isEqualTo(REFRESH_TOKEN);
    }
}
