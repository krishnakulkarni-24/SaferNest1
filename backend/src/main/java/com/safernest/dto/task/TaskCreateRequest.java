package com.safernest.dto.task;

import com.safernest.enums.TaskPriority;
import com.safernest.enums.TaskStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
public class TaskCreateRequest {

    @NotNull
    private UUID incidentId;

    @NotNull
    private TaskStatus status;

    @NotNull
    private TaskPriority priority;
}
