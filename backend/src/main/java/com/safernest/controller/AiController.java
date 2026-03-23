package com.safernest.controller;

import com.safernest.dto.ai.SummaryRequestDTO;
import com.safernest.dto.ai.SummaryResponseDTO;
import com.safernest.service.AiService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AiController {

    private final AiService aiService;

    @PostMapping("/summarize")
    @PreAuthorize("hasAnyRole('AUTHORITY','ADMIN')")
    public ResponseEntity<SummaryResponseDTO> summarize(@Valid @RequestBody SummaryRequestDTO request,
                                                        @RequestParam(defaultValue = "15") int limit) {
        List<String> reports = request.getReports();
        String summary = (reports == null || reports.isEmpty())
                ? aiService.summarizeRecentIncidents(limit)
                : aiService.summarizeReports(reports);

        return ResponseEntity.ok(new SummaryResponseDTO(summary));
    }
}
