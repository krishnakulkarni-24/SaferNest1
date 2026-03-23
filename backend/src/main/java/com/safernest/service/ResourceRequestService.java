package com.safernest.service;

import com.safernest.dto.request.ResourceRequestCreateRequest;
import com.safernest.dto.request.ResourceRequestResponse;

import java.util.List;

public interface ResourceRequestService {
    ResourceRequestResponse createRequest(ResourceRequestCreateRequest request, String requesterEmail);
    List<ResourceRequestResponse> getAllRequests();
}
