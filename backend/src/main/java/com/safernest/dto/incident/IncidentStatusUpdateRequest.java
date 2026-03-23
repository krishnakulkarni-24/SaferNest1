package com.safernest.dto.incident;

import com.safernest.enums.IncidentStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class IncidentStatusUpdateRequest {

    @NotNull
    private IncidentStatus status;
}
