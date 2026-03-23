package com.safernest.mapper;

import com.safernest.dto.task.TaskResponse;
import com.safernest.entity.Task;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface TaskMapper {

    @Mapping(target = "incidentId", source = "incident.id")
    @Mapping(target = "incidentTitle", source = "incident.title")
    @Mapping(target = "assignedToId", source = "assignedTo.id")
    @Mapping(target = "assignedToName", source = "assignedTo.name")
    TaskResponse toResponse(Task task);
}
