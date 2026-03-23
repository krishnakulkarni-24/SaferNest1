package com.safernest.service;

import com.safernest.dto.auth.AuthResponse;
import com.safernest.dto.auth.LoginRequest;
import com.safernest.dto.auth.RegisterRequest;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
}
