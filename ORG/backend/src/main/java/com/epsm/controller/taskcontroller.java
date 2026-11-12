package com.epsm.controller;

import com.epsm.dto.apires;
import com.epsm.dto.taskdto;
import com.epsm.model.project;
import com.epsm.model.task;
import com.epsm.model.taskcomment;
import com.epsm.repository.projectrepo;
import com.epsm.repository.taskcommentrepo;
import com.epsm.repository.taskrepo;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

// 1. task controller - rest endpoints for tasks and team collaboration (PDF Section 6.4 & 11)
@RestController
@RequestMapping("/api/v1/tasks")
public class taskcontroller {

    private final taskrepo repo;
    private final projectrepo projectrepo;
    private final taskcommentrepo commentrepo;

    public record CommentDto(Long id, Long taskId, String author, String role, String content, LocalDateTime createdAt) {
        public static CommentDto from(taskcomment c) {
            return new CommentDto(c.getId(), c.getTask() != null ? c.getTask().getId() : null, c.getAuthor(), c.getRole(), c.getContent(), c.getCreatedAt());
        }
    }

    public record CommentReq(String author, String role, String content) {}

    public taskcontroller(taskrepo repo, projectrepo projectrepo, taskcommentrepo commentrepo) {
        this.repo = repo;
        this.projectrepo = projectrepo;
        this.commentrepo = commentrepo;
    }

    // 2. get all tasks
    @GetMapping
    public ResponseEntity<apires<List<taskdto.Res>>> getAll() {
        List<taskdto.Res> list = repo.findAll()
                .stream()
                .map(taskdto.Res::from)
                .toList();
        return ResponseEntity.ok(apires.ok("Tasks fetched", list));
    }

    // 3. create new task
    @PostMapping
    public ResponseEntity<apires<taskdto.Res>> create(@Valid @RequestBody taskdto.Req req) {
        project p = null;
        if (req.getProjectCode() != null && !req.getProjectCode().isBlank()) {
            p = projectrepo.findByCode(req.getProjectCode()).orElse(null);
        }
        if (p == null && projectrepo.count() > 0) {
            p = projectrepo.findAll().get(0);
        }

        task t = new task(
                req.getCode().toUpperCase(),
                req.getTitle(),
                req.getDescription(),
                req.getPriority() != null ? req.getPriority().toUpperCase() : "MEDIUM",
                req.getPoints() != null ? req.getPoints() : 3,
                req.getStatus() != null ? req.getStatus().toUpperCase() : "TODO",
                req.getAssignee(),
                req.getTeam() != null ? req.getTeam() : "Platform Core",
                req.getMentor() != null ? req.getMentor() : "Karthik Swaminathan",
                p
        );

        task saved = repo.save(t);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(apires.ok("Task created successfully", taskdto.Res.from(saved)));
    }

    // 4. patch task status (supports both query param ?status=DONE and json body {"status":"DONE"})
    @RequestMapping(value = "/{id}/status", method = {RequestMethod.PATCH, RequestMethod.PUT})
    public ResponseEntity<apires<taskdto.Res>> updateStatus(
            @PathVariable Long id,
            @RequestParam(required = false) String status,
            @RequestBody(required = false) Map<String, String> body
    ) {
        Optional<task> opt = repo.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(apires.err("Task not found with id: " + id));
        }

        task t = opt.get();
        String newStatus = status;
        if ((newStatus == null || newStatus.isBlank()) && body != null) {
            newStatus = body.get("status");
        }

        if (newStatus != null && !newStatus.isBlank()) {
            t.setStatus(newStatus.toUpperCase());
        }

        task saved = repo.save(t);
        return ResponseEntity.ok(apires.ok("Task status updated", taskdto.Res.from(saved)));
    }

    // 5. get task comments for collaboration stream (PDF Section 6.4)
    @GetMapping("/{id}/comments")
    public ResponseEntity<apires<List<CommentDto>>> getComments(@PathVariable Long id) {
        List<CommentDto> list = commentrepo.findByTaskIdOrderByCreatedAtAsc(id)
                .stream()
                .map(CommentDto::from)
                .toList();
        return ResponseEntity.ok(apires.ok("Comments fetched", list));
    }

    // 6. post comment to task (PDF Section 6.4 & 6.5)
    @PostMapping("/{id}/comments")
    public ResponseEntity<apires<CommentDto>> addComment(
            @PathVariable Long id,
            @RequestBody CommentReq req
    ) {
        Optional<task> opt = repo.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(apires.err("Task not found with id: " + id));
        }

        task t = opt.get();
        String author = (req.author() != null && !req.author().isBlank()) ? req.author() : "Yuvraj V";
        String role = (req.role() != null && !req.role().isBlank()) ? req.role() : "Software Engineer";
        String content = (req.content() != null && !req.content().isBlank()) ? req.content() : "";

        taskcomment tc = new taskcomment(t, author, role, content);
        taskcomment saved = commentrepo.save(tc);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(apires.ok("Comment added", CommentDto.from(saved)));
    }
}

