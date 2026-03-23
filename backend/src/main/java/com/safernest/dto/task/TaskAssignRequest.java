package com.safernest.dto.task;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
public class TaskAssignRequest {

    @NotNull
    private UUID volunteerId;
}
