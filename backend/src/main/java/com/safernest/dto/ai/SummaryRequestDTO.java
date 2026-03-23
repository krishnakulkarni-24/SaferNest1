package com.safernest.dto.ai;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class SummaryRequestDTO {

    @NotNull
    private List<String> reports;
}
