package com.safernest.mapper;

import com.safernest.dto.incident.IncidentResponse;
import com.safernest.entity.Incident;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface IncidentMapper {

    @Mapping(target = "reportedById", source = "reportedBy.id")
    @Mapping(target = "reportedByName", source = "reportedBy.name")
    IncidentResponse toResponse(Incident incident);
}
