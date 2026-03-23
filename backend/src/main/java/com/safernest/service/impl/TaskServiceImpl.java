package com.safernest.service.impl;

import com.safernest.dto.task.TaskAssignRequest;
import com.safernest.dto.task.TaskCreateRequest;
import com.safernest.dto.task.TaskResponse;
import com.safernest.entity.Incident;
import com.safernest.entity.Task;
import com.safernest.entity.User;
import com.safernest.enums.Role;
import com.safernest.enums.TaskStatus;
import com.safernest.exception.BadRequestException;
import com.safernest.exception.NotFoundException;
import com.safernest.mapper.TaskMapper;
import com.safernest.repository.IncidentRepository;
import com.safernest.repository.TaskRepository;
import com.safernest.repository.UserRepository;
import com.safernest.service.NotificationService;
import com.safernest.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;
    private final IncidentRepository incidentRepository;
    private final UserRepository userRepository;
    private final TaskMapper taskMapper;
    private final NotificationService notificationService;

    @Override
    @Transactional
    public TaskResponse createTask(TaskCreateRequest request) {
        Incident incident = incidentRepository.findById(request.getIncidentId())
                .orElseThrow(() -> new NotFoundException("Incident not found"));

        Task task = Task.builder()
                .incident(incident)
                .status(request.getStatus())
                .priority(request.getPriority())
                .build();

        TaskResponse response = taskMapper.toResponse(taskRepository.save(task));
        notificationService.broadcast("TASK_CREATED", "New task created", response);
        return response;
    }

    @Override
    public List<TaskResponse> getAllTasks() {
        return taskRepository.findAll().stream().map(taskMapper::toResponse).toList();
    }

    @Override
    @Transactional
    public TaskResponse assignTask(UUID taskId, TaskAssignRequest request) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new NotFoundException("Task not found"));

        User volunteer = userRepository.findById(request.getVolunteerId())
                .orElseThrow(() -> new NotFoundException("Volunteer not found"));

        if (volunteer.getRole() != Role.VOLUNTEER) {
            throw new BadRequestException("Assigned user must have VOLUNTEER role");
        }

        task.setAssignedTo(volunteer);
        task.setStatus(TaskStatus.ASSIGNED);

        TaskResponse response = taskMapper.toResponse(taskRepository.save(task));
        notificationService.broadcast("TASK_ASSIGNED", "Task assigned to volunteer", response);
        return response;
    }

    @Override
    @Transactional
    public TaskResponse completeTask(UUID taskId, String actorEmail) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new NotFoundException("Task not found"));

        User actor = userRepository.findByEmail(actorEmail)
                .orElseThrow(() -> new NotFoundException("User not found"));

        if (actor.getRole() == Role.VOLUNTEER) {
            if (task.getAssignedTo() == null || !task.getAssignedTo().getId().equals(actor.getId())) {
                throw new AccessDeniedException("Volunteers can complete only their assigned tasks");
            }
        }

        task.setStatus(TaskStatus.COMPLETED);
        TaskResponse response = taskMapper.toResponse(taskRepository.save(task));
        notificationService.broadcast("TASK_COMPLETED", "Task marked as completed", response);
        return response;
    }

    @Override
    @Transactional
    public void deleteTask(UUID taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new NotFoundException("Task not found"));

        taskRepository.delete(task);
        notificationService.broadcast("TASK_DELETED", "Task deleted", taskId);
    }
}
