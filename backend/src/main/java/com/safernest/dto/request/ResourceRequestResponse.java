package com.safernest.dto.request;

import com.safernest.enums.RequestStatus;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
public class ResourceRequestResponse {
    private UUID id;
    private UUID userId;
    private String userName;
    private UUID resourceId;
    private String resourceType;
    private RequestStatus status;
}
