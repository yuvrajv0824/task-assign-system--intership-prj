package com.epsm.config;

import com.epsm.model.*;
import com.epsm.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

// 1. auto data seeder for enterprise prototype
@Configuration
public class dataseeder {

    // 2. seed initial users, projects, tasks, milestones, tickets, approvals, and audit logs
    @Bean
    public CommandLineRunner seedData(
            projectrepo projectrepo,
            userrepo userrepo,
            taskrepo taskrepo,
            milestonerepo milestonerepo,
            ticketrepo ticketrepo,
            approvalrepo approvalrepo,
            auditlogrepo auditlogrepo,
            notificationrepo notificationrepo,
            sprintrepo sprintrepo,
            taskcommentrepo taskcommentrepo,
            PasswordEncoder passwordEncoder
    ) {
        return args -> {
            // 3. seed users for enterprise corporate roles (Executive, Management, Engineering, Support)
            if (userrepo.count() == 0) {
                userrepo.save(new user("admin", "admin@epsm.internal", passwordEncoder.encode("password123"), role.ROLE_ADMIN, "Executive Leadership", true));
                userrepo.save(new user("anita.rao", "anita@epsm.internal", passwordEncoder.encode("password123"), role.ROLE_PROJECT_MANAGER, "Project Management Office", true));
                userrepo.save(new user("karthik.s", "karthik@epsm.internal", passwordEncoder.encode("password123"), role.ROLE_TEAM_LEAD, "Core Platform Squad", true));
                userrepo.save(new user("yuvraj.v", "yuvraj@epsm.internal", passwordEncoder.encode("password123"), role.ROLE_TEAM_MEMBER, "Platform Development", true));
                userrepo.save(new user("priya.s", "priya@epsm.internal", passwordEncoder.encode("password123"), role.ROLE_SERVICE_AGENT, "IT Operations & Support", true));
                userrepo.save(new user("neha.k", "neha@epsm.internal", passwordEncoder.encode("password123"), role.ROLE_TEAM_LEAD, "People & Operations", true));
            }

            // 4. seed initial projects
            if (projectrepo.count() == 0) {
                project p1 = projectrepo.save(new project(
                        "PRJ-101",
                        "Enterprise SSO & Authentication Gateway",
                        "Centralized authentication gateway with stateless JWT validation and role-based permissions",
                        "Anita Rao",
                        "ON_TRACK",
                        85,
                        LocalDate.now().plusDays(14),
                        "ACTIVE"
                ));

                project p2 = projectrepo.save(new project(
                        "PRJ-102",
                        "Cloud Database Resilience Migration",
                        "Zero-downtime database migration from on-prem to cloud RDS with HikariCP pooling",
                        "Karthik Swaminathan",
                        "ON_TRACK",
                        60,
                        LocalDate.now().plusDays(30),
                        "ACTIVE"
                ));

                project p3 = projectrepo.save(new project(
                        "PRJ-103",
                        "Customer Service SLA Portal",
                        "Automated incident management desk with real-time SLA countdown and threshold alerts",
                        "Yuvraj V",
                        "AT_RISK",
                        45,
                        LocalDate.now().plusDays(21),
                        "ACTIVE"
                ));

                project p4 = projectrepo.save(new project(
                        "PRJ-104",
                        "Real-Time Incident Notification Service",
                        "Automated event notification system for critical production system alerts",
                        "Priya Sharma",
                        "DELAYED",
                        30,
                        LocalDate.now().plusDays(7),
                        "ACTIVE"
                ));

                // 5. seed tasks with realistic estimated effort hours
                if (taskrepo.count() == 0) {
                    taskrepo.save(new task("TSK-01", "Spring Boot 3 pure ORM setup", "Configure JPA and H2 profile with Hibernate", "HIGH", 8, "DONE", "Yuvraj V", "Platform Core", "Anita Rao", p1));
                    taskrepo.save(new task("TSK-02", "BaseEntity auditing timestamps", "Auto-generated @CreatedDate and @LastModifiedDate", "MEDIUM", 4, "REVIEW", "Karthik Swaminathan", "Core Platform Squad", "Vikram Mehta", p1));
                    taskrepo.save(new task("TSK-04", "SLA countdown calculation service", "Engine to trigger warning at 75% elapsed resolution time", "HIGH", 16, "IN_PROGRESS", "Yuvraj V", "Platform Core", "Anita Rao", p3));
                    taskrepo.save(new task("TSK-05", "Stateless JWT filter integration", "Validate Bearer token on all secured endpoints", "CRITICAL", 8, "IN_PROGRESS", "Yuvraj V", "Platform Core", "Karthik Swaminathan", p1));
                    taskrepo.save(new task("TSK-08", "PostgreSQL connection pooling", "HikariCP pool sizing and leak detection threshold", "HIGH", 8, "TODO", "Karthik Swaminathan", "Core Platform Squad", "Vikram Mehta", p2));
                    taskrepo.save(new task("TSK-09", "User role permission matrix", "Map 5 enterprise roles to authorized endpoints", "MEDIUM", 8, "TODO", "Anita Rao", "Project Management Office", "Vikram Mehta", p1));
                    taskrepo.save(new task("TSK-12", "Audit log export to CSV", "Export project audit trails for compliance reporting", "LOW", 4, "BACKLOG", "Yuvraj V", "Platform Core", "Anita Rao", p2));
                    taskrepo.save(new task("TSK-14", "Two-factor auth mockups", "UX wireframes for SMS and TOTP authenticator setup", "MEDIUM", 8, "BACKLOG", "Priya Sharma", "IT Operations & Support", "Karthik Swaminathan", p4));
                }

                // 6. seed milestones (PDF Module 6.3)
                if (milestonerepo.count() == 0) {
                    milestonerepo.save(new milestone("PRJ-101", "Core Auth & JWT Token Provider", "Complete HMAC-SHA256 token issue and refresh lifecycle", "Anita Rao", LocalDate.now().plusDays(4), "COMPLETED", 100));
                    milestonerepo.save(new milestone("PRJ-101", "RBAC Permission Guard Middleware", "Enforce 5 roles across all REST controllers", "Yuvraj V", LocalDate.now().plusDays(10), "IN_PROGRESS", 70));
                    milestonerepo.save(new milestone("PRJ-102", "PostgreSQL HikariCP Staging Validation", "Run pool stress tests with 100 concurrent workers", "Karthik Swaminathan", LocalDate.now().plusDays(14), "IN_PROGRESS", 50));
                    milestonerepo.save(new milestone("PRJ-103", "Real-Time 75% SLA Breach Alerts", "Engine triggers high-priority warning when resolution reaches 75%", "Yuvraj V", LocalDate.now().plusDays(7), "IN_PROGRESS", 40));
                    milestonerepo.save(new milestone("PRJ-104", "SMS & Webhook Dispatch Integration", "Multi-channel broadcast microservice for incident alerts", "Priya Sharma", LocalDate.now().minusDays(2), "OVERDUE", 25));
                }

                // 7. seed service desk incident tickets (PDF Module 6.5)
                if (ticketrepo.count() == 0) {
                    ticketrepo.save(new ticket(
                            "TKT-101",
                            "Payment webhook timeout during checkout",
                            "High timeout rate on payment callback processing under peak traffic",
                            "CRITICAL",
                            "IN_PROGRESS",
                            "Payment Operations Desk",
                            2,
                            LocalDateTime.now().minusHours(1).minusMinutes(45)
                    ));

                    ticketrepo.save(new ticket(
                            "TKT-102",
                            "Slow database query on financial reporting export",
                            "CSV audit export query exceeds connection threshold causing pool starvation",
                            "HIGH",
                            "IN_PROGRESS",
                            "Finance Operations Desk",
                            4,
                            LocalDateTime.now().minusHours(3).minusMinutes(10)
                    ));

                    ticketrepo.save(new ticket(
                            "TKT-103",
                            "User unable to authenticate via single sign-on",
                            "SAML assertion failure on corporate gateway redirect",
                            "MEDIUM",
                            "IN_PROGRESS",
                            "Operations Desk",
                            8,
                            LocalDateTime.now().minusHours(1).minusMinutes(30)
                    ));

                    ticketrepo.save(new ticket(
                            "TKT-104",
                            "Kubernetes ingress certificate expiration warning",
                            "TLS cert renewal failed on production cluster ingress controller",
                            "MEDIUM",
                            "RESOLVED",
                            "DevOps Operations",
                            8,
                            LocalDateTime.now().minusHours(12)
                    ));
                }

                // 8. seed approval workflow requests (PDF Module 6.6)
                if (approvalrepo.count() == 0) {
                    approvalrepo.save(new approval("APR-101", "Production Database Schema Migration", "DEPLOYMENT", "PRJ-102", "Karthik Swaminathan", "Anita Rao", "APPROVED", "HIGH", "Executes Flyway V2 script adding foreign keys to transaction logs"));
                    approvalrepo.save(new approval("APR-102", "Allocate 15 Story Points for OAuth2 Refactor", "BUDGET", "PRJ-101", "Yuvraj V", "Anita Rao", "APPROVED", "MEDIUM", "Scope extension for enterprise Azure AD single sign-on federation"));
                    approvalrepo.save(new approval("APR-103", "Cloud Server Scale-up for Traffic Peak", "DEPLOYMENT", "PRJ-103", "Karthik Swaminathan", "Vikram Mehta", "PENDING", "HIGH", "Request to spin up 4 additional c6g.xlarge worker instances"));
                    approvalrepo.save(new approval("APR-104", "External Security Penetration Test Access", "SECURITY", "PRJ-104", "Priya Sharma", "Vikram Mehta", "APPROVED", "CRITICAL", "Grant read-only staging VPC access to third-party auditor"));
                }

                // 9. seed security audit logs (PDF Module 10)
                if (auditlogrepo.count() == 0) {
                    auditlogrepo.save(new auditlog("system.bootstrap", "SYSTEM_INIT", "PLATFORM", "Enterprise platform booted with Pure JPA ORM profile", "127.0.0.1"));
                    auditlogrepo.save(new auditlog("admin", "USER_ROLE_ASSIGNED", "yuvraj.v", "Assigned ROLE_TEAM_MEMBER on Platform Core squad", "192.168.1.10"));
                    auditlogrepo.save(new auditlog("anita.rao", "APPROVAL_GRANTED", "APR-101", "Approved Production Database Schema Migration", "192.168.1.12"));
                    auditlogrepo.save(new auditlog("yuvraj.v", "TASK_STATUS_UPDATE", "TSK-01", "Spring Boot 3 pure ORM setup moved to DONE (+5 story points)", "192.168.1.15"));
                }

                // 10. seed enterprise desk alerts & dms (PDF Module 6.5 & 6.6)
                if (notificationrepo.count() == 0) {
                    notificationrepo.save(new notification("NTF-101", "Yuvraj V", "Service Desk SLA", "SLA_ALERT", "Critical SLA Warning on TKT-101", "Memory Leak on Background Task Runner has elapsed 82% of target SLA. Immediate action required.", "CRITICAL"));
                    notificationrepo.save(new notification("NTF-102", "Anita Rao", "DevOps Desk", "APPROVAL_REQUEST", "Deployment Approval Required: PRJ-102", "Karthik Swaminathan submitted production database schema migration for review.", "HIGH"));
                    notificationrepo.save(new notification("NTF-103", "Yuvraj V", "Karthik Swaminathan", "DIRECT_MESSAGE", "Sprint 25 Architecture Review", "Great progress on the JPA controllers. Please verify all SLA countdown edge cases today.", "MEDIUM"));
                    notificationrepo.save(new notification("NTF-104", "All", "Cloud Infrastructure", "SYSTEM_NOTICE", "Maintenance Window Announcement", "Flyway schema V2 migration scheduled for Sunday 11:00 PM IST.", "LOW"));
                }

                // 11. seed sprint cycles & release versions (PDF Module 6.4)
                if (sprintrepo.count() == 0) {
                    sprintrepo.save(new sprint("SPR-24", "Sprint 24: Core Entity Mappings & JWT", "v1.1.0-RELEASE", "Bootstrap initial models, pure JPA repositories, and stateless authentication", LocalDate.now().minusWeeks(3), LocalDate.now().minusWeeks(1), "COMPLETED", 38, 38));
                    sprintrepo.save(new sprint("SPR-25", "Sprint 25: Service Desk SLA & Pure ORM", "v1.2.0-RC1", "Complete Service Desk SLA Countdown and JPA ORM entity mappings with 0 warnings", LocalDate.now().minusWeeks(1), LocalDate.now().plusWeeks(1), "ACTIVE", 45, 28));
                    sprintrepo.save(new sprint("SPR-26", "Sprint 26: Release Versioning & Epics", "v1.3.0-DEV", "Implement sprint cycle lifecycle planning, automated release versioning, and capacity balancer", LocalDate.now().plusWeeks(1), LocalDate.now().plusWeeks(3), "PLANNED", 40, 0));
                }

                // 12. seed task collaboration discussions (PDF Module 6.4 & 6.5)
                if (taskcommentrepo.count() == 0 && taskrepo.count() > 0) {
                    List<task> seededTasks = taskrepo.findAll();
                    task t1 = seededTasks.get(0);
                    taskcommentrepo.save(new taskcomment(t1, "Anita Rao", "Project Manager", "Please verify the connection pool sizing under peak SLA load."));
                    taskcommentrepo.save(new taskcomment(t1, "Yuvraj V", "Software Engineer", "Configured HikariCP pool maximum to 20 with zero connection leak."));
                    taskcommentrepo.save(new taskcomment(t1, "Karthik Swaminathan", "Team Lead", "Reviewed query execution plan on staging; indexes validated."));

                    if (seededTasks.size() > 1) {
                        task t2 = seededTasks.get(1);
                        taskcommentrepo.save(new taskcomment(t2, "Karthik Swaminathan", "Team Lead", "Please verify JWT token refresh edge cases with expired claims."));
                        taskcommentrepo.save(new taskcomment(t2, "Yuvraj V", "Software Engineer", "Added clock skew leeway check and 401 unauthorized header."));
                    }
                }
            }
        };
    }
}
