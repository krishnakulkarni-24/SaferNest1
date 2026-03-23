package com.safernest.mapper;

import com.safernest.dto.request.ResourceRequestResponse;
import com.safernest.entity.ResourceRequest;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ResourceRequestMapper {

    @Mapping(target = "userId", source = "user.id")
    @Mapping(target = "userName", source = "user.name")
    @Mapping(target = "resourceId", source = "resource.id")
    @Mapping(target = "resourceType", source = "resource.type")
    ResourceRequestResponse toResponse(ResourceRequest request);
}
