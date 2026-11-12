package com.epsm.model;

import jakarta.persistence.*;

// 1. taskcomment entity - collaborative discussion and activity notes on tasks (PDF Section 6.4 & 10)
@Entity
@Table(name = "task_comments")
public class taskcomment extends baseentity {

    // 2. associated task
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "task_id", nullable = false)
    private task task;

    // 3. author persona name
    @Column(nullable = false, length = 60)
    private String author;

    // 4. author corporate role title
    @Column(length = 60)
    private String role;

    // 5. comment body text
    @Column(nullable = false, length = 1000)
    private String content;

    public taskcomment() {}

    public taskcomment(task task, String author, String role, String content) {
        this.task = task;
        this.author = author;
        this.role = role;
        this.content = content;
    }

    public task getTask() { return task; }
    public void setTask(task task) { this.task = task; }

    public String getAuthor() { return author; }
    public void setAuthor(String author) { this.author = author; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
}

