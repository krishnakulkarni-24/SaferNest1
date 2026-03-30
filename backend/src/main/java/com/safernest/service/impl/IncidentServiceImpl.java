package com.safernest.service.impl;

import com.safernest.dto.incident.IncidentCreateRequest;
import com.safernest.dto.incident.IncidentResponse;
import com.safernest.entity.Incident;
import com.safernest.entity.User;
import com.safernest.enums.IncidentStatus;
import com.safernest.exception.NotFoundException;
import com.safernest.mapper.IncidentMapper;
import com.safernest.repository.IncidentRepository;
import com.safernest.repository.UserRepository;
import com.safernest.service.IncidentService;
import com.safernest.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class IncidentServiceImpl implements IncidentService {

    private final IncidentRepository incidentRepository;
    private final UserRepository userRepository;
    private final IncidentMapper incidentMapper;
    private final NotificationService notificationService;

    @Override
    @Transactional
    public IncidentResponse createIncident(IncidentCreateRequest request, String reporterEmail) {
        User reporter = userRepository.findByEmail(reporterEmail)
                .orElseThrow(() -> new NotFoundException("Reporter user not found"));

        Incident incident = Incident.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .locationLat(request.getLocationLat())
                .locationLng(request.getLocationLng())
                .status(IncidentStatus.REPORTED)
                .reportedBy(reporter)
                .build();

        Incident saved = incidentRepository.save(incident);
        IncidentResponse response = incidentMapper.toResponse(saved);

        notificationService.broadcast("NEW_INCIDENT", "New incident reported", response);
        return response;
    }

    @Override
    public List<IncidentResponse> getAllIncidents() {
        return incidentRepository.findAll().stream().map(incidentMapper::toResponse).toList();
    }

    @Override
    @Transactional
    public IncidentResponse updateStatus(UUID id, IncidentStatus status) {
        Incident incident = incidentRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Incident not found"));
        incident.setStatus(status);

        Incident saved = incidentRepository.save(incident);
        IncidentResponse response = incidentMapper.toResponse(saved);

        notificationService.broadcast("INCIDENT_STATUS_UPDATED", "Incident status updated", response);
        return response;
    }
    @Override
    @Transactional
    public void deleteIncident(UUID id) {
        Incident incident = incidentRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Incident not found"));
        incidentRepository.delete(incident);
        notificationService.broadcast("INCIDENT_DELETED", "Incident deleted", id);
    }
}
