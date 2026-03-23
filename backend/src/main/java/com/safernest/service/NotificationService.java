package com.safernest.service;

public interface NotificationService {
    void broadcast(String type, String message, Object payload);
}
