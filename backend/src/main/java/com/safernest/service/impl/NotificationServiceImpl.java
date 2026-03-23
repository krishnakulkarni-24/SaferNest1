package com.safernest.service.impl;

import com.safernest.dto.notification.NotificationMessage;
import com.safernest.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final SimpMessagingTemplate messagingTemplate;

    @Override
    public void broadcast(String type, String message, Object payload) {
        NotificationMessage notification = NotificationMessage.builder()
                .type(type)
                .message(message)
                .payload(payload)
                .timestamp(Instant.now())
                .build();

        messagingTemplate.convertAndSend("/topic/updates", notification);
    }
}
