package com.safernest.dto.auth;

import com.safernest.enums.Role;
import lombok.Builder;
import lombok.Getter;

import java.util.UUID;

@Getter
@Builder
public class AuthResponse {
    private String token;
    private UUID userId;
    private String name;
    private String email;
    private Role role;
}
