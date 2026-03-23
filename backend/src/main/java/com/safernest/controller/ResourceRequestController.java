package com.safernest.controller;

import com.safernest.dto.request.ResourceRequestCreateRequest;
import com.safernest.dto.request.ResourceRequestResponse;
import com.safernest.service.ResourceRequestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/requests")
@RequiredArgsConstructor
public class ResourceRequestController {

    private final ResourceRequestService requestService;

    @PostMapping
    @PreAuthorize("hasAnyRole('CITIZEN','VOLUNTEER','AUTHORITY','ADMIN')")
    public ResponseEntity<ResourceRequestResponse> createRequest(@Valid @RequestBody ResourceRequestCreateRequest request,
                                                                 Authentication authentication) {
        return ResponseEntity.ok(requestService.createRequest(request, authentication.getName()));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('AUTHORITY','ADMIN')")
    public ResponseEntity<List<ResourceRequestResponse>> getAllRequests() {
        return ResponseEntity.ok(requestService.getAllRequests());
    }
}
