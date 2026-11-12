package com.epsm.repository;

import com.epsm.model.task;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

// 1. task repository - pure orm interface
@Repository
public interface taskrepo extends JpaRepository<task, Long> {

    // 2. find all tasks eagerly joining project to prevent N+1 queries
    @Override
    @EntityGraph(attributePaths = {"project"})
    List<task> findAll();

    // 3. find by unique task code (e.g. PRJ-101-TSK-1)
    Optional<task> findByCode(String code);

    // 4. find all tasks by workflow status
    List<task> findByStatus(String status);

    // 5. find tasks assigned to mentee / engineer
    List<task> findByAssignee(String assignee);
}

