package com.uxstudio.contactapp.filter;

import com.uxstudio.contactapp.service.impl.UserDetailsServiceImpl;
import com.uxstudio.contactapp.util.JWTProvider;
import com.uxstudio.contactapp.exception.UnauthorizedException;
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
        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);
            try {
                String userName = jwtProvider.extractUsername(token);
                if (userName != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                    if (jwtProvider.isTokenValid(token, userName)) {
                        UserDetails userDetails = userDetailsService.loadUserByUsername(userName);
                        UsernamePasswordAuthenticationToken passAuthToken =
                                new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                        passAuthToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                        SecurityContextHolder.getContext().setAuthentication(passAuthToken);
                    }
                }
            } catch (JwtException | IllegalArgumentException ex) {
                SecurityContextHolder.clearContext();
                throw new UnauthorizedException("Invalid or expired token: " + ex.getMessage());
            } catch (Exception ex) {
                SecurityContextHolder.clearContext();
                throw new UnauthorizedException("Authentication failed");
            }
        }
        filterChain.doFilter(request, response);
    }
}