package com.safernest.dto.incident;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class IncidentCreateRequest {

    @NotBlank
    private String title;

    @NotBlank
    private String description;

    @NotNull
    @Min(-90)
    @Max(90)
    private Double locationLat;

    @NotNull
    @Min(-180)
    @Max(180)
    private Double locationLng;
}
