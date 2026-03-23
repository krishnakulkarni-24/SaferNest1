package com.safernest.service.impl;

import com.safernest.dto.request.ResourceRequestCreateRequest;
import com.safernest.dto.request.ResourceRequestResponse;
import com.safernest.entity.Resource;
import com.safernest.entity.ResourceRequest;
import com.safernest.entity.User;
import com.safernest.enums.RequestStatus;
import com.safernest.exception.NotFoundException;
import com.safernest.mapper.ResourceRequestMapper;
import com.safernest.repository.ResourceRepository;
import com.safernest.repository.ResourceRequestRepository;
import com.safernest.repository.UserRepository;
import com.safernest.service.ResourceRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ResourceRequestServiceImpl implements ResourceRequestService {

    private final ResourceRequestRepository requestRepository;
    private final ResourceRepository resourceRepository;
    private final UserRepository userRepository;
    private final ResourceRequestMapper requestMapper;

    @Override
    @Transactional
    public ResourceRequestResponse createRequest(ResourceRequestCreateRequest request, String requesterEmail) {
        User user = userRepository.findByEmail(requesterEmail)
                .orElseThrow(() -> new NotFoundException("User not found"));

        Resource resource = resourceRepository.findById(request.getResourceId())
                .orElseThrow(() -> new NotFoundException("Resource not found"));

        ResourceRequest resourceRequest = ResourceRequest.builder()
                .user(user)
                .resource(resource)
                .status(RequestStatus.PENDING)
                .build();

        return requestMapper.toResponse(requestRepository.save(resourceRequest));
    }

    @Override
    public List<ResourceRequestResponse> getAllRequests() {
        return requestRepository.findAll().stream().map(requestMapper::toResponse).toList();
    }
}
