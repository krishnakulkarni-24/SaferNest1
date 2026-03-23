package com.safernest.dto.task;

import com.safernest.enums.TaskPriority;
import com.safernest.enums.TaskStatus;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
public class TaskResponse {
    private UUID id;
    private UUID incidentId;
    private String incidentTitle;
    private UUID assignedToId;
    private String assignedToName;
    private TaskStatus status;
    private TaskPriority priority;
}
