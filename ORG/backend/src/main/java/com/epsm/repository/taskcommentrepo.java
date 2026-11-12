package com.epsm.repository;

import com.epsm.model.taskcomment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

// 1. task comment repository - pure orm interface for collaboration notes
@Repository
public interface taskcommentrepo extends JpaRepository<taskcomment, Long> {
    List<taskcomment> findByTaskIdOrderByCreatedAtAsc(Long taskId);
}

