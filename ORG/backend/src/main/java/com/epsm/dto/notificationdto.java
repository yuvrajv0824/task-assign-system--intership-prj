package com.epsm.dto;

import com.epsm.model.notification;

import java.time.LocalDateTime;

public class notificationdto {

    public static class Req {
        private String recipient;
        private String sender;
        private String type;
        private String title;
        private String message;
        private String priority;

        public Req() {}

        public String getRecipient() { return recipient; }
        public void setRecipient(String recipient) { this.recipient = recipient; }

        public String getSender() { return sender; }
        public void setSender(String sender) { this.sender = sender; }

        public String getType() { return type; }
        public void setType(String type) { this.type = type; }

        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }

        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }

        public String getPriority() { return priority; }
        public void setPriority(String priority) { this.priority = priority; }
    }

    public static class Res {
        private Long id;
        private String code;
        private String recipient;
        private String sender;
        private String type;
        private String title;
        private String message;
        private boolean isRead;
        private String priority;
        private LocalDateTime createdAt;

        public Res() {}

        public static Res from(notification n) {
            Res r = new Res();
            r.id = n.getId();
            r.code = n.getCode();
            r.recipient = n.getRecipient();
            r.sender = n.getSender();
            r.type = n.getType();
            r.title = n.getTitle();
            r.message = n.getMessage();
            r.isRead = n.isRead();
            r.priority = n.getPriority();
            r.createdAt = n.getCreatedAt();
            return r;
        }

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public String getCode() { return code; }
        public void setCode(String code) { this.code = code; }

        public String getRecipient() { return recipient; }
        public void setRecipient(String recipient) { this.recipient = recipient; }

        public String getSender() { return sender; }
        public void setSender(String sender) { this.sender = sender; }

        public String getType() { return type; }
        public void setType(String type) { this.type = type; }

        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }

        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }

        public boolean isRead() { return isRead; }
        public void setRead(boolean read) { isRead = read; }

        public String getPriority() { return priority; }
        public void setPriority(String priority) { this.priority = priority; }

        public LocalDateTime getCreatedAt() { return createdAt; }
        public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    }
}
