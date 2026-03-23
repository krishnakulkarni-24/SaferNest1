package com.safernest.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.safernest.entity.Incident;
import com.safernest.repository.IncidentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class AiService {

    private static final String FALLBACK_SUMMARY = "Unable to generate summary at the moment.";

    private final ObjectMapper objectMapper;
    private final IncidentRepository incidentRepository;

    @Value("${openai.api-key:}")
    private String openAiApiKey;

    @Value("${openai.base-url:https://api.openai.com}")
    private String openAiBaseUrl;

    @Value("${openai.model:gpt-4o-mini}")
    private String openAiModel;

    @Value("${openai.max-tokens:180}")
    private Integer openAiMaxTokens;

    public String summarizeReports(List<String> reports) {
        if (reports == null || reports.isEmpty()) {
            return FALLBACK_SUMMARY;
        }

        if (openAiApiKey == null || openAiApiKey.isBlank()) {
            log.warn("AI summarize skipped because OPENAI_API_KEY is missing");
            return FALLBACK_SUMMARY;
        }

        try {
            String prompt = buildPrompt(reports);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(openAiApiKey);

            Map<String, Object> payload = new LinkedHashMap<>();
            payload.put("model", openAiModel);
            payload.put("messages", List.of(
                    Map.of("role", "system", "content", "You summarize disaster incidents for emergency command teams."),
                    Map.of("role", "user", "content", prompt)
            ));
            payload.put("temperature", 0.2);
            payload.put("max_tokens", openAiMaxTokens);

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, headers);

            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<String> response = restTemplate.exchange(
                    openAiBaseUrl + "/v1/chat/completions",
                    HttpMethod.POST,
                    request,
                    String.class
            );

            String responseBody = response.getBody();
            if (responseBody == null || responseBody.isBlank()) {
                return FALLBACK_SUMMARY;
            }

            JsonNode root = objectMapper.readTree(responseBody);
            JsonNode contentNode = root.path("choices").path(0).path("message").path("content");

            if (contentNode.isMissingNode() || contentNode.isNull()) {
                return FALLBACK_SUMMARY;
            }

            String summary = contentNode.asText().trim();
            return summary.isEmpty() ? FALLBACK_SUMMARY : summary;
        } catch (Exception exception) {
            log.warn("AI summarize failed: {}", exception.getMessage());
            return FALLBACK_SUMMARY;
        }
    }

    public String summarizeRecentIncidents(int limit) {
        try {
            int effectiveLimit = Math.max(1, Math.min(limit, 50));

            List<String> reports = incidentRepository.findAll(
                            PageRequest.of(0, effectiveLimit, Sort.by(Sort.Direction.DESC, "createdAt"))
                    )
                    .getContent()
                    .stream()
                    .map(Incident::getDescription)
                    .filter(Objects::nonNull)
                    .map(String::trim)
                    .filter(value -> !value.isBlank())
                    .collect(Collectors.toList());

            if (reports.isEmpty()) {
                return "No recent incident reports available.";
            }

            return summarizeReports(reports);
        } catch (Exception exception) {
            log.warn("Failed to load recent incidents for summary: {}", exception.getMessage());
            return FALLBACK_SUMMARY;
        }
    }

    private String buildPrompt(List<String> reports) {
        String incidentList = reports.stream()
                .map(report -> "- " + report)
                .collect(Collectors.joining("\n"));

        return "Summarize the following disaster reports into a short, clear, and professional summary for emergency authorities. Focus on severity, affected people, and urgency.\n\n"
                + "Reports:\n"
                + incidentList
                + "\n\n"
                + "Keep it concise (2-3 lines).";
    }
}
