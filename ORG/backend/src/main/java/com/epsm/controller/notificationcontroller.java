package com.epsm.controller;

import com.epsm.dto.apires;
import com.epsm.dto.notificationdto;
import com.epsm.model.notification;
import com.epsm.repository.notificationrepo;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/notifications")
@CrossOrigin(origins = "*")
public class notificationcontroller {

    private final notificationrepo notificationrepo;

    public notificationcontroller(notificationrepo notificationrepo) {
        this.notificationrepo = notificationrepo;
    }

    // 1. fetch notifications filtered by recipient or all
    @GetMapping
    public ResponseEntity<apires<List<notificationdto.Res>>> getNotifications(
            @RequestParam(required = false) String recipient
    ) {
        List<notification> list;
        if (recipient != null && !recipient.isBlank()) {
            list = notificationrepo.findByRecipientOrderByCreatedAtDesc(recipient);
        } else {
            list = notificationrepo.findAllByOrderByCreatedAtDesc();
        }

        List<notificationdto.Res> res = list.stream()
                .map(notificationdto.Res::from)
                .collect(Collectors.toList());

        return ResponseEntity.ok(apires.ok("Notifications retrieved", res));
    }

    // 2. mark single notification as read
    @PutMapping("/{id}/read")
    public ResponseEntity<apires<notificationdto.Res>> markAsRead(@PathVariable Long id) {
        notification n = notificationrepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found with id: " + id));

        n.setRead(true);
        notification saved = notificationrepo.save(n);
        return ResponseEntity.ok(apires.ok("Notification marked as read", notificationdto.Res.from(saved)));
    }

    // 3. mark all notifications as read for a recipient
    @PutMapping("/read-all")
    public ResponseEntity<apires<String>> markAllRead(@RequestParam(required = false) String recipient) {
        List<notification> list;
        if (recipient != null && !recipient.isBlank()) {
            list = notificationrepo.findByRecipientOrderByCreatedAtDesc(recipient);
        } else {
            list = notificationrepo.findAll();
        }

        list.forEach(n -> n.setRead(true));
        notificationrepo.saveAll(list);
        return ResponseEntity.ok(apires.ok("All notifications marked as read", "Updated " + list.size() + " items"));
    }

    // 4. broadcast new notification or dm
    @PostMapping
    public ResponseEntity<apires<notificationdto.Res>> createNotification(@RequestBody notificationdto.Req req) {
        String code = "NTF-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        notification n = new notification(
                code,
                req.getRecipient(),
                req.getSender() != null ? req.getSender() : "System",
                req.getType() != null ? req.getType() : "SYSTEM_NOTICE",
                req.getTitle(),
                req.getMessage(),
                req.getPriority() != null ? req.getPriority() : "MEDIUM"
        );

        notification saved = notificationrepo.save(n);
        return ResponseEntity.ok(apires.ok("Notification published", notificationdto.Res.from(saved)));
    }
}
