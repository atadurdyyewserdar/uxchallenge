package com.uxstudio.contactapp.filter;

import com.uxstudio.contactapp.service.impl.UserDetailsServiceImpl;
import com.uxstudio.contactapp.util.JWTProvider;
import com.uxstudio.contactapp.exception.UnauthorizedException;
import com.uxstudio.contactapp.constants.ExceptionConstants;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JWTFilter extends OncePerRequestFilter {

    private final JWTProvider jwtProvider;
    private final UserDetailsServiceImpl userDetailsService;
    private final Logger LOGGER = LoggerFactory.getLogger(getClass());

    @Autowired
    public JWTFilter(JWTProvider jwtProvider, UserDetailsServiceImpl userDetailsService) {
        this.jwtProvider = jwtProvider;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String header = request.getHeader("Authorization");
        
        // checking for authorization header with bearer token is present
        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);
            LOGGER.debug("JWT token received from request: {}", request.getRequestURI());
            
            try {
                // we extract username from JWT and only set authentication if username is valid and no existing authentication
                String userName = jwtProvider.extractUsername(token);
                
                if (userName != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                    
                    // Validate token
                    if (jwtProvider.isTokenValid(token, userName)) {
                        LOGGER.debug("Token validated successfully for {}", userName);
                        
                        UserDetails userDetails = userDetailsService.loadUserByUsername(userName);
                        UsernamePasswordAuthenticationToken passAuthToken =
                                new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                        passAuthToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                        SecurityContextHolder.getContext().setAuthentication(passAuthToken);
                        
                        LOGGER.info("User authenticated successfully: {} from {}", userName, request.getRequestURI());
                    } else {
                        LOGGER.warn("Token validation failed for user: {} - token expired or signature mismatch", userName);
                    }
                }
            } catch (JwtException ex) {
                LOGGER.warn("JWT exception during token validation: {}", ex.getMessage());
                SecurityContextHolder.clearContext();
                throw new UnauthorizedException(ExceptionConstants.INVALID_OR_EXPIRED_TOKEN + ": " + ex.getMessage());
            } catch (IllegalArgumentException ex) {
                LOGGER.warn("Illegal argument during token processing: {}", ex.getMessage());
                SecurityContextHolder.clearContext();
                throw new UnauthorizedException(ExceptionConstants.INVALID_OR_EXPIRED_TOKEN + ": " + ex.getMessage());
            } catch (Exception ex) {
                LOGGER.error("Exception during JWT filter execution", ex);
                SecurityContextHolder.clearContext();
                throw new UnauthorizedException("Authentication failed");
            }
        } else if (header != null) {
            LOGGER.debug("Authorization header present but does not start with Bearer: {}", request.getRequestURI());
        }
        
        filterChain.doFilter(request, response);
    }
}