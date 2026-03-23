package com.safernest.dto.notification;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.Instant;

@Getter
@Builder
@AllArgsConstructor
public class NotificationMessage {
    private String type;
    private String message;
    private Object payload;
    private Instant timestamp;
}
