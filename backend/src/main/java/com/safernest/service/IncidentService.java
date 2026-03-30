package com.safernest.service;

import com.safernest.dto.incident.IncidentCreateRequest;
import com.safernest.dto.incident.IncidentResponse;
import com.safernest.enums.IncidentStatus;

import java.util.List;
import java.util.UUID;

public interface IncidentService {
    IncidentResponse createIncident(IncidentCreateRequest request, String reporterEmail);
    List<IncidentResponse> getAllIncidents();
    IncidentResponse updateStatus(UUID id, IncidentStatus status);
    void deleteIncident(UUID id);
}
