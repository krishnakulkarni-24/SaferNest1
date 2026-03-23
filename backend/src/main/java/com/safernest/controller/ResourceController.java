package com.safernest.controller;

import com.safernest.dto.resource.ResourceCreateRequest;
import com.safernest.dto.resource.ResourceResponse;
import com.safernest.service.ResourceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/resources")
@RequiredArgsConstructor
public class ResourceController {

    private final ResourceService resourceService;

    @PostMapping
    @PreAuthorize("hasAnyRole('AUTHORITY','ADMIN')")
    public ResponseEntity<ResourceResponse> createResource(@Valid @RequestBody ResourceCreateRequest request) {
        return ResponseEntity.ok(resourceService.createResource(request));
    }

    @GetMapping
    public ResponseEntity<List<ResourceResponse>> getAllResources() {
        return ResponseEntity.ok(resourceService.getAllResources());
    }
}
