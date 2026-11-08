package com.epsm.repository;

import com.epsm.model.sprint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface sprintrepo extends JpaRepository<sprint, Long> {

    Optional<sprint> findByStatus(String status);

    List<sprint> findAllByOrderByStartDateDesc();
}
