package com.safernest.config;

import com.safernest.entity.Incident;
import com.safernest.entity.Resource;
import com.safernest.entity.ResourceRequest;
import com.safernest.entity.Task;
import com.safernest.entity.User;
import com.safernest.enums.IncidentStatus;
import com.safernest.enums.RequestStatus;
import com.safernest.enums.ResourceStatus;
import com.safernest.enums.ResourceType;
import com.safernest.enums.Role;
import com.safernest.enums.TaskPriority;
import com.safernest.enums.TaskStatus;
import com.safernest.repository.IncidentRepository;
import com.safernest.repository.ResourceRepository;
import com.safernest.repository.ResourceRequestRepository;
import com.safernest.repository.TaskRepository;
import com.safernest.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
@ConditionalOnProperty(prefix = "app.seed", name = "enabled", havingValue = "true")
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final IncidentRepository incidentRepository;
    private final ResourceRepository resourceRepository;
    private final TaskRepository taskRepository;
    private final ResourceRequestRepository requestRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        User admin = upsertUser("System Admin", "admin@safernest.com", "Admin@123", Role.ADMIN, "+91-9000000001");
        User authority = upsertUser("City Authority", "authority@safernest.com", "Authority@123", Role.AUTHORITY, "+91-9000000002");
        User volunteer = upsertUser("Field Volunteer", "volunteer@safernest.com", "Volunteer@123", Role.VOLUNTEER, "+91-9000000003");
        User citizen = upsertUser("Local Citizen", "citizen@safernest.com", "Citizen@123", Role.CITIZEN, "+91-9000000004");

        if (resourceRepository.count() == 0) {
            resourceRepository.saveAll(List.of(
                    Resource.builder().type(ResourceType.FOOD).quantity(300).location("Community Hall A").status(ResourceStatus.AVAILABLE).build(),
                    Resource.builder().type(ResourceType.MEDICAL).quantity(120).location("District Hospital").status(ResourceStatus.AVAILABLE).build(),
                    Resource.builder().type(ResourceType.SHELTER).quantity(80).location("Relief Camp North").status(ResourceStatus.AVAILABLE).build(),
                    Resource.builder().type(ResourceType.WATER).quantity(500).location("Water Depot East").status(ResourceStatus.AVAILABLE).build(),
                    Resource.builder().type(ResourceType.TRANSPORT).quantity(25).location("Logistics Hub South").status(ResourceStatus.AVAILABLE).build(),
                    Resource.builder().type(ResourceType.OTHER).quantity(60).location("Emergency Warehouse West").status(ResourceStatus.AVAILABLE).build()
            ));
        }

        if (incidentRepository.count() == 0) {
            incidentRepository.saveAll(List.of(
                    Incident.builder()
                            .title("Urban Flooding in Sector 9")
                            .description("Water level is rising near residential blocks and roads are blocked.")
                            .locationLat(19.0760)
                            .locationLng(72.8777)
                            .status(IncidentStatus.REPORTED)
                            .reportedBy(citizen)
                            .build(),
                    Incident.builder()
                            .title("Landslide Risk Near Hill Zone")
                            .description("Cracks detected on slope and families requested evacuation support.")
                            .locationLat(18.5204)
                            .locationLng(73.8567)
                            .status(IncidentStatus.IN_PROGRESS)
                            .reportedBy(authority)
                            .build()
            ));
        }

        List<Incident> incidents = incidentRepository.findAll();
        List<Resource> resources = resourceRepository.findAll();

        if (taskRepository.count() == 0 && !incidents.isEmpty()) {
            taskRepository.saveAll(List.of(
                    Task.builder()
                            .incident(incidents.get(0))
                            .assignedTo(volunteer)
                            .status(TaskStatus.ASSIGNED)
                            .priority(TaskPriority.HIGH)
                            .build(),
                    Task.builder()
                            .incident(incidents.get(incidents.size() - 1))
                            .status(TaskStatus.CREATED)
                            .priority(TaskPriority.CRITICAL)
                            .build()
            ));
        }

        if (requestRepository.count() == 0 && !resources.isEmpty()) {
            requestRepository.save(
                    ResourceRequest.builder()
                            .user(citizen)
                            .resource(resources.get(0))
                            .status(RequestStatus.PENDING)
                            .build()
            );
        }

        log.info("SaferNest seed data is ready. Sample logins: admin@safernest.com, authority@safernest.com, volunteer@safernest.com, citizen@safernest.com");
    }

    private User upsertUser(String name, String email, String rawPassword, Role role, String phone) {
        return userRepository.findByEmail(email).orElseGet(() -> userRepository.save(
                User.builder()
                        .name(name)
                        .email(email)
                        .password(passwordEncoder.encode(rawPassword))
                        .role(role)
                        .phone(phone)
                        .build()
        ));
    }
}
