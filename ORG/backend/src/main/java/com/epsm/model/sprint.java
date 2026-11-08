package com.epsm.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.LocalDate;

@Entity
@Table(name = "sprints")
public class sprint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String code;

    @Column(nullable = false)
    private String name;

    @Column(name = "version_tag", nullable = false)
    private String versionTag; // e.g. v1.2.0-RELEASE

    @Column(length = 500)
    private String goal;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Column(nullable = false)
    private String status; // ACTIVE, PLANNED, COMPLETED

    @Column(name = "committed_points", nullable = false)
    private int committedPoints;

    @Column(name = "completed_points", nullable = false)
    private int completedPoints;

    public sprint() {}

    public sprint(String code, String name, String versionTag, String goal, LocalDate startDate, LocalDate endDate, String status, int committedPoints, int completedPoints) {
        this.code = code;
        this.name = name;
        this.versionTag = versionTag;
        this.goal = goal;
        this.startDate = startDate;
        this.endDate = endDate;
        this.status = status;
        this.committedPoints = committedPoints;
        this.completedPoints = completedPoints;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getVersionTag() { return versionTag; }
    public void setVersionTag(String versionTag) { this.versionTag = versionTag; }

    public String getGoal() { return goal; }
    public void setGoal(String goal) { this.goal = goal; }

    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public int getCommittedPoints() { return committedPoints; }
    public void setCommittedPoints(int committedPoints) { this.committedPoints = committedPoints; }

    public int getCompletedPoints() { return completedPoints; }
    public void setCompletedPoints(int completedPoints) { this.completedPoints = completedPoints; }
}
