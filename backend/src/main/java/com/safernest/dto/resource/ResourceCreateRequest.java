package com.safernest.dto.resource;

import com.safernest.enums.ResourceType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResourceCreateRequest {

    @NotNull
    private ResourceType type;

    @NotNull
    @Min(1)
    private Integer quantity;

    @NotBlank
    private String location;
}
