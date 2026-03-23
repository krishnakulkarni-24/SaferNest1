package com.safernest.mapper;

import com.safernest.dto.resource.ResourceResponse;
import com.safernest.entity.Resource;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ResourceMapper {
    ResourceResponse toResponse(Resource resource);
}
