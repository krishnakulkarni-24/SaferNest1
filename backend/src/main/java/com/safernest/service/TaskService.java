package com.safernest.service;

import com.safernest.dto.task.TaskAssignRequest;
import com.safernest.dto.task.TaskCreateRequest;
import com.safernest.dto.task.TaskResponse;

import java.util.List;
import java.util.UUID;

public interface TaskService {
    TaskResponse createTask(TaskCreateRequest request);
    List<TaskResponse> getAllTasks();
    TaskResponse assignTask(UUID taskId, TaskAssignRequest request);
    TaskResponse completeTask(UUID taskId, String actorEmail);
    void deleteTask(UUID taskId);
}
