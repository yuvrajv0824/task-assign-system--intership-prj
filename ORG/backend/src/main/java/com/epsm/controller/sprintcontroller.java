package com.epsm.controller;

import com.epsm.dto.apires;
import com.epsm.dto.sprintdto;
import com.epsm.model.sprint;
import com.epsm.repository.sprintrepo;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/sprints")
@CrossOrigin(origins = "*")
public class sprintcontroller {

    private final sprintrepo sprintrepo;

    public sprintcontroller(sprintrepo sprintrepo) {
        this.sprintrepo = sprintrepo;
    }

    // 1. fetch all sprint cycles
    @GetMapping
    public ResponseEntity<apires<List<sprintdto.Res>>> getAllSprints() {
        List<sprintdto.Res> res = sprintrepo.findAllByOrderByStartDateDesc().stream()
                .map(sprintdto.Res::from)
                .collect(Collectors.toList());

        return ResponseEntity.ok(apires.ok("Sprint cycles retrieved", res));
    }

    // 2. fetch currently active sprint cycle
    @GetMapping("/active")
    public ResponseEntity<apires<sprintdto.Res>> getActiveSprint() {
        return sprintrepo.findByStatus("ACTIVE")
                .map(s -> ResponseEntity.ok(apires.ok("Active sprint cycle retrieved", sprintdto.Res.from(s))))
                .orElseGet(() -> ResponseEntity.ok(apires.ok("No active sprint cycle", null)));
    }

    // 3. create new sprint cycle
    @PostMapping
    public ResponseEntity<apires<sprintdto.Res>> createSprint(@RequestBody sprintdto.Req req) {
        String code = "SPR-" + UUID.randomUUID().toString().substring(0, 4).toUpperCase();
        sprint s = new sprint(
                code,
                req.getName(),
                req.getVersionTag() != null ? req.getVersionTag() : "v1.0.0-SNAPSHOT",
                req.getGoal(),
                req.getStartDate(),
                req.getEndDate(),
                "PLANNED",
                req.getCommittedPoints(),
                0
        );

        sprint saved = sprintrepo.save(s);
        return ResponseEntity.ok(apires.ok("Sprint cycle created", sprintdto.Res.from(saved)));
    }

    // 4. close/complete an active sprint
    @PutMapping("/{id}/close")
    public ResponseEntity<apires<sprintdto.Res>> closeSprint(@PathVariable Long id) {
        sprint s = sprintrepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Sprint cycle not found with id: " + id));

        s.setStatus("COMPLETED");
        sprint saved = sprintrepo.save(s);
        return ResponseEntity.ok(apires.ok("Sprint cycle completed", sprintdto.Res.from(saved)));
    }
}
