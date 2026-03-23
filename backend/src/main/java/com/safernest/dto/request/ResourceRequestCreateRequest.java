package com.safernest.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
public class ResourceRequestCreateRequest {

    @NotNull
    private UUID resourceId;
}
