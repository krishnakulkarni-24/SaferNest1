package com.safernest.dto.resource;

import com.safernest.enums.ResourceStatus;
import com.safernest.enums.ResourceType;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
public class ResourceResponse {
    private UUID id;
    private ResourceType type;
    private Integer quantity;
    private String location;
    private ResourceStatus status;
}
