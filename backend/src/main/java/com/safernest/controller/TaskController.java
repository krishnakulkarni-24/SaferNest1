package com.safernest.controller;

import com.safernest.dto.task.TaskAssignRequest;
import com.safernest.dto.task.TaskCreateRequest;
import com.safernest.dto.task.TaskResponse;
import com.safernest.service.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @PostMapping
    @PreAuthorize("hasAnyRole('AUTHORITY','ADMIN')")
    public ResponseEntity<TaskResponse> createTask(@Valid @RequestBody TaskCreateRequest request) {
        return ResponseEntity.ok(taskService.createTask(request));
    }

    @GetMapping
    public ResponseEntity<List<TaskResponse>> getAllTasks() {
        return ResponseEntity.ok(taskService.getAllTasks());
    }

    @PutMapping("/{id}/assign")
    @PreAuthorize("hasAnyRole('AUTHORITY','ADMIN','VOLUNTEER')")
    public ResponseEntity<TaskResponse> assignTask(@PathVariable UUID id,
                                                   @Valid @RequestBody TaskAssignRequest request) {
        return ResponseEntity.ok(taskService.assignTask(id, request));
    }

    @PutMapping("/{id}/complete")
    @PreAuthorize("hasAnyRole('VOLUNTEER','AUTHORITY','ADMIN')")
    public ResponseEntity<TaskResponse> completeTask(@PathVariable UUID id, Authentication authentication) {
        return ResponseEntity.ok(taskService.completeTask(id, authentication.getName()));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('AUTHORITY','ADMIN')")
    public ResponseEntity<Void> deleteTask(@PathVariable UUID id) {
        taskService.deleteTask(id);
        return ResponseEntity.noContent().build();
    }
}
