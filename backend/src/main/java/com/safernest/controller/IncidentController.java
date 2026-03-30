package com.safernest.controller;

import com.safernest.dto.incident.IncidentCreateRequest;
import com.safernest.dto.incident.IncidentResponse;
import com.safernest.dto.incident.IncidentStatusUpdateRequest;
import com.safernest.service.IncidentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.DeleteMapping;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/incidents")
@RequiredArgsConstructor
public class IncidentController {

    private final IncidentService incidentService;

    @PostMapping
    @PreAuthorize("hasAnyRole('CITIZEN','AUTHORITY','ADMIN')")
    public ResponseEntity<IncidentResponse> createIncident(@Valid @RequestBody IncidentCreateRequest request,
                                                           Authentication authentication) {
        return ResponseEntity.ok(incidentService.createIncident(request, authentication.getName()));
    }

    @GetMapping
    public ResponseEntity<List<IncidentResponse>> getAllIncidents() {
        return ResponseEntity.ok(incidentService.getAllIncidents());
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('AUTHORITY','ADMIN')")
    public ResponseEntity<IncidentResponse> updateStatus(@PathVariable UUID id,
                                                         @Valid @RequestBody IncidentStatusUpdateRequest request) {
        return ResponseEntity.ok(incidentService.updateStatus(id, request.getStatus()));
    }
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('AUTHORITY','ADMIN')")
    public ResponseEntity<Void> deleteIncident(@PathVariable UUID id) {
        incidentService.deleteIncident(id);
        return ResponseEntity.noContent().build();
    }
}
