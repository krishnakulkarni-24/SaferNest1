package com.safernest.service.impl;

import com.safernest.dto.resource.ResourceCreateRequest;
import com.safernest.dto.resource.ResourceResponse;
import com.safernest.entity.Resource;
import com.safernest.enums.ResourceStatus;
import com.safernest.mapper.ResourceMapper;
import com.safernest.repository.ResourceRepository;
import com.safernest.service.ResourceService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ResourceServiceImpl implements ResourceService {

    private final ResourceRepository resourceRepository;
    private final ResourceMapper resourceMapper;

    @Override
    @Transactional
    public ResourceResponse createResource(ResourceCreateRequest request) {
        Resource resource = Resource.builder()
                .type(request.getType())
                .quantity(request.getQuantity())
                .location(request.getLocation())
                .status(ResourceStatus.AVAILABLE)
                .build();

        return resourceMapper.toResponse(resourceRepository.save(resource));
    }

    @Override
    public List<ResourceResponse> getAllResources() {
        return resourceRepository.findAll().stream().map(resourceMapper::toResponse).toList();
    }
}
