package com.epsm.repository;

import com.epsm.model.notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface notificationrepo extends JpaRepository<notification, Long> {

    List<notification> findByRecipientOrderByCreatedAtDesc(String recipient);

    List<notification> findAllByOrderByCreatedAtDesc();

    long countByRecipientAndIsReadFalse(String recipient);
}
