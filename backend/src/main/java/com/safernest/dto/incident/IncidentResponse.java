package com.safernest.dto.incident;

import com.safernest.enums.IncidentStatus;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

@Getter
@Setter
public class IncidentResponse {
    private UUID id;
    private String title;
    private String description;
    private Double locationLat;
    private Double locationLng;
    private IncidentStatus status;
    private UUID reportedById;
    private String reportedByName;
    private Instant createdAt;
}
