package com.safernest.service;

import com.safernest.dto.resource.ResourceCreateRequest;
import com.safernest.dto.resource.ResourceResponse;

import java.util.List;

public interface ResourceService {
    ResourceResponse createResource(ResourceCreateRequest request);
    List<ResourceResponse> getAllResources();
}
