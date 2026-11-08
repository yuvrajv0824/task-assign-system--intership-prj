package com.epsm.dto;

import com.epsm.model.sprint;

import java.time.LocalDate;

public class sprintdto {

    public static class Req {
        private String name;
        private String versionTag;
        private String goal;
        private LocalDate startDate;
        private LocalDate endDate;
        private int committedPoints;

        public Req() {}

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

        public int getCommittedPoints() { return committedPoints; }
        public void setCommittedPoints(int committedPoints) { this.committedPoints = committedPoints; }
    }

    public static class Res {
        private Long id;
        private String code;
        private String name;
        private String versionTag;
        private String goal;
        private LocalDate startDate;
        private LocalDate endDate;
        private String status;
        private int committedPoints;
        private int completedPoints;
        private int progressPercent;

        public Res() {}

        public static Res from(sprint s) {
            Res r = new Res();
            r.id = s.getId();
            r.code = s.getCode();
            r.name = s.getName();
            r.versionTag = s.getVersionTag();
            r.goal = s.getGoal();
            r.startDate = s.getStartDate();
            r.endDate = s.getEndDate();
            r.status = s.getStatus();
            r.committedPoints = s.getCommittedPoints();
            r.completedPoints = s.getCompletedPoints();
            r.progressPercent = s.getCommittedPoints() > 0 
                    ? Math.min(100, (int) Math.round(((double) s.getCompletedPoints() / s.getCommittedPoints()) * 100))
                    : 0;
            return r;
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

        public int getProgressPercent() { return progressPercent; }
        public void setProgressPercent(int progressPercent) { this.progressPercent = progressPercent; }
    }
}
