package com.safernest.repository;

import com.safernest.entity.ResourceRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ResourceRequestRepository extends JpaRepository<ResourceRequest, UUID> {
}
