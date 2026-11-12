import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ProgressBar } from '../components/ui/ProgressBar';
import { 
  FolderKanban, 
  Calendar, 
  CheckSquare, 
  Flag, 
  Check, 
  Trash2, 
  ChevronLeft, 
  ChevronRight, 
  Video,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Zap,
  ShieldCheck,
  Users,
  Activity,
  Layers,
  Award
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { useAuth } from '../context/AuthContext';

export function DashboardPage({
  projects,
  tasks,
  milestones,
  reminders,
  onToggleReminder,
  onDeleteReminder,
  onOpenNewTask,
  onOpenNewProject,
  onNavigate,
}) {
  const { user } = useAuth();
  const [selectedDay, setSelectedDay] = useState('05');

  // Dynamic greeting based on current hour
  const currentHour = new Date().getHours();
  const greetingTime = currentHour < 12 ? 'Good morning' : currentHour < 17 ? 'Good afternoon' : 'Good evening';
  const firstName = user?.name ? user.name.split(' ')[0] : 'Engineer';

  const calendarDays = [
    { day: 'Wed', date: '04' },
    { day: 'Thu', date: '05' },
    { day: 'Fri', date: '06' },
    { day: 'Sat', date: '07' },
    { day: 'Sun', date: '08' },
    { day: 'Mon', date: '09' },
    { day: 'Tue', date: '10' },
  ];

  // Sprint velocity data for recharts (navy line only, light grid, no clutter)
  const velocityData = [
    { sprint: 'Sprint 21', points: 34, target: 40 },
    { sprint: 'Sprint 22', points: 38, target: 40 },
    { sprint: 'Sprint 23', points: 42, target: 40 },
    { sprint: 'Sprint 24', points: 39, target: 40 },
    { sprint: 'Sprint 25', points: 45, target: 40 },
  ];

  // Active user's tasks
  const myTasks = tasks.filter((t) => {
    if (!t.assignee) return false;
    return t.assignee.toLowerCase().includes(firstName.toLowerCase());
  });

  return (
    <div className="space-y-6">
      {/* Header: small date, "Good evening, Yuvraj" at 32px, one primary "New task", one secondary "New project" */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2">
        <div className="space-y-1">
          <div className="text-xs text-text-muted font-medium">
            {new Date().toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' })}
          </div>
          <h1 className="text-[32px] font-semibold text-text tracking-tight leading-tight">
            {greetingTime}, {firstName}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={onOpenNewProject}>
            New project
          </Button>
          <Button variant="primary" size="sm" onClick={onOpenNewTask}>
            New task
          </Button>
        </div>
      </div>

      {/* PDF Section 8: Executive Key Performance Indicators (KPIs) with Vibrant Enterprise Palette */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
        <div className="p-3 rounded-card bg-surface border border-blue-200 dark:border-blue-900/50 hover:border-blue-400 space-y-1.5 shadow-xs transition">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-text-muted font-medium truncate">Active Projects</span>
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          </div>
          <div className="text-xl font-bold tracking-tight text-blue-600 dark:text-blue-400 tabular-nums">24</div>
          <div className="text-[10px] text-blue-600/80 dark:text-blue-400/80 font-medium truncate bg-blue-50 dark:bg-blue-950/40 px-1.5 py-0.5 rounded">
            Portfolio Target
          </div>
        </div>

        <div className="p-3 rounded-card bg-surface border border-amber-200 dark:border-amber-900/50 hover:border-amber-400 space-y-1.5 shadow-xs transition">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-text-muted font-medium truncate">Projects At Risk</span>
            <span className="w-2 h-2 rounded-full bg-amber-500" />
          </div>
          <div className="text-xl font-bold tracking-tight text-amber-600 dark:text-amber-400 tabular-nums">4</div>
          <div className="text-[10px] text-amber-600/80 dark:text-amber-400/80 font-medium truncate bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.5 rounded">
            Requires PM Review
          </div>
        </div>

        <div className="p-3 rounded-card bg-surface border border-sky-200 dark:border-sky-900/50 hover:border-sky-400 space-y-1.5 shadow-xs transition">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-text-muted font-medium truncate">Open Tasks</span>
            <span className="w-2 h-2 rounded-full bg-sky-500" />
          </div>
          <div className="text-xl font-bold tracking-tight text-sky-600 dark:text-sky-400 tabular-nums">186</div>
          <div className="text-[10px] text-sky-600/80 dark:text-sky-400/80 font-medium truncate bg-sky-50 dark:bg-sky-950/40 px-1.5 py-0.5 rounded">
            Across 5 Squads
          </div>
        </div>

        <div className="p-3 rounded-card bg-surface border border-rose-200 dark:border-rose-900/50 hover:border-rose-400 space-y-1.5 shadow-xs transition">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-text-muted font-medium truncate">Overdue Tasks</span>
            <span className="w-2 h-2 rounded-full bg-rose-500" />
          </div>
          <div className="text-xl font-bold tracking-tight text-rose-600 dark:text-rose-400 tabular-nums">23</div>
          <div className="text-[10px] text-rose-600/80 dark:text-rose-400/80 font-medium truncate bg-rose-50 dark:bg-rose-950/40 px-1.5 py-0.5 rounded">
            Escalated to Lead
          </div>
        </div>

        <div className="p-3 rounded-card bg-surface border border-purple-200 dark:border-purple-900/50 hover:border-purple-400 space-y-1.5 shadow-xs transition">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-text-muted font-medium truncate">Open Issues</span>
            <span className="w-2 h-2 rounded-full bg-purple-500" />
          </div>
          <div className="text-xl font-bold tracking-tight text-purple-600 dark:text-purple-400 tabular-nums">41</div>
          <div className="text-[10px] text-purple-600/80 dark:text-purple-400/80 font-medium truncate bg-purple-50 dark:bg-purple-950/40 px-1.5 py-0.5 rounded">
            Service Desk Desk
          </div>
        </div>

        <div className="p-3 rounded-card bg-surface border border-red-200 dark:border-red-900/50 hover:border-red-400 space-y-1.5 shadow-xs transition">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-text-muted font-medium truncate">SLA Breaches</span>
            <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
          </div>
          <div className="text-xl font-bold tracking-tight text-red-600 dark:text-red-400 tabular-nums">5</div>
          <div className="text-[10px] text-red-600/80 dark:text-red-400/80 font-medium truncate bg-red-50 dark:bg-red-950/40 px-1.5 py-0.5 rounded">
            Incident Priority
          </div>
        </div>

        <div className="p-3 rounded-card bg-surface border border-indigo-200 dark:border-indigo-900/50 hover:border-indigo-400 space-y-1.5 shadow-xs transition">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-text-muted font-medium truncate">Pending Approvals</span>
            <span className="w-2 h-2 rounded-full bg-indigo-500" />
          </div>
          <div className="text-xl font-bold tracking-tight text-indigo-600 dark:text-indigo-400 tabular-nums">12</div>
          <div className="text-[10px] text-indigo-600/80 dark:text-indigo-400/80 font-medium truncate bg-indigo-50 dark:bg-indigo-950/40 px-1.5 py-0.5 rounded">
            Awaiting PM / CTO
          </div>
        </div>

        <div className="p-3 rounded-card bg-surface border border-emerald-200 dark:border-emerald-900/50 hover:border-emerald-400 space-y-1.5 shadow-xs transition">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-text-muted font-medium truncate">Team Members</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          </div>
          <div className="text-xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400 tabular-nums">48</div>
          <div className="text-[10px] text-emerald-600/80 dark:text-emerald-400/80 font-medium truncate bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded">
            88% Capacity
          </div>
        </div>
      </div>

      {/* User Progress & Engineering Performance Track (PDF Section 6.8 & 8) */}
      <Card className="p-4 bg-gradient-to-r from-blue-50/50 via-surface to-indigo-50/40 dark:from-blue-950/20 dark:via-surface dark:to-indigo-950/20 border-blue-200 dark:border-blue-900/40 space-y-3.5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold text-sm flex items-center justify-center shadow-xs">
              {user?.name ? user.name.split(' ').map((n) => n[0]).join('') : 'YV'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-text">{user?.name || 'Yuvraj V'}</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                  Sprint Track: 92% Velocity (On Track)
                </span>
              </div>
              <p className="text-xs text-text-muted mt-0.5">
                Senior Full Stack Software Engineer &bull; Squad: Platform Core &bull; Supervisor: Karthik Swaminathan (Team Lead)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="px-2.5 py-1 rounded bg-surface border border-border text-text font-medium">
              Sprint Cycle 25
            </span>
            <span className="px-2.5 py-1 rounded bg-blue-600 text-white font-semibold shadow-xs">
              Active Sprint
            </span>
          </div>
        </div>

        {/* 4 Performance Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* 1. Tasks Completed */}
          <div className="p-3 rounded-input bg-surface border border-border hover:border-emerald-400 space-y-2 shadow-xs transition">
            <div className="flex items-center justify-between text-xs">
              <span className="text-text-muted flex items-center gap-1.5 font-medium">
                <CheckSquare className="w-3.5 h-3.5 text-emerald-600" />
                Tasks Completed
              </span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">14 / 16 (88%)</span>
            </div>
            <div className="w-full bg-emerald-100 dark:bg-emerald-950/40 rounded-full h-2 overflow-hidden">
              <div className="bg-emerald-500 h-2 rounded-full transition-all duration-300" style={{ width: '88%' }} />
            </div>
            <div className="text-[10px] text-text-faint flex justify-between">
              <span>Goal: 16 tasks</span>
              <span className="text-emerald-600 font-semibold">+2 closed today</span>
            </div>
          </div>

          {/* 2. Sprint Effort Capacity */}
          <div className="p-3 rounded-input bg-surface border border-border hover:border-blue-400 space-y-2 shadow-xs transition">
            <div className="flex items-center justify-between text-xs">
              <span className="text-text-muted flex items-center gap-1.5 font-medium">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                Sprint Hours Burned
              </span>
              <span className="font-bold text-blue-600 dark:text-blue-400 tabular-nums">36h / 40h</span>
            </div>
            <div className="w-full bg-blue-100 dark:bg-blue-950/40 rounded-full h-2 overflow-hidden">
              <div className="bg-blue-600 h-2 rounded-full transition-all duration-300" style={{ width: '90%' }} />
            </div>
            <div className="text-[10px] text-text-faint flex justify-between">
              <span>Weekly 40h capacity</span>
              <span className="text-blue-600 font-semibold">4h remaining</span>
            </div>
          </div>

          {/* 3. SLA Compliance */}
          <div className="p-3 rounded-input bg-surface border border-border hover:border-amber-400 space-y-2 shadow-xs transition">
            <div className="flex items-center justify-between text-xs">
              <span className="text-text-muted flex items-center gap-1.5 font-medium">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                SLA Compliance Rate
              </span>
              <span className="font-bold text-text tabular-nums">98.5%</span>
            </div>
            <div className="w-full bg-amber-100 dark:bg-amber-950/40 rounded-full h-2 overflow-hidden">
              <div className="bg-amber-500 h-2 rounded-full transition-all duration-300" style={{ width: '98.5%' }} />
            </div>
            <div className="text-[10px] text-text-faint flex justify-between">
              <span>Target: &gt; 95%</span>
              <span className="text-emerald-600 font-semibold">0 SLA breaches</span>
            </div>
          </div>

          {/* 4. Code Reviews & Governance */}
          <div className="p-3 rounded-input bg-surface border border-border hover:border-indigo-400 space-y-2 shadow-xs transition">
            <div className="flex items-center justify-between text-xs">
              <span className="text-text-muted flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                Review Turnaround
              </span>
              <span className="font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">2.1h avg</span>
            </div>
            <div className="w-full bg-indigo-100 dark:bg-indigo-950/40 rounded-full h-2 overflow-hidden">
              <div className="bg-indigo-600 h-2 rounded-full transition-all duration-300" style={{ width: '85%' }} />
            </div>
            <div className="text-[10px] text-text-faint flex justify-between">
              <span>Peer review velocity</span>
              <span className="text-indigo-600 font-semibold">Top 5% squad</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Bento Grid: Calm, precise, left-aligned */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* LEFT COLUMN (7 COLS): Projects, Calendar strip, Reminders */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* 1. Projects Card (recent 4) */}
          <Card className="space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <div className="flex items-center gap-2">
                <FolderKanban className="w-4 h-4 text-text-muted" strokeWidth={1.5} />
                <h2 className="text-base font-semibold text-text tracking-tight">Projects</h2>
              </div>
              <button
                onClick={() => onNavigate('projects')}
                className="text-xs text-text-muted hover:text-text"
              >
                View all &rarr;
              </button>
            </div>

            <div className="space-y-2">
              {projects.slice(0, 4).map((p) => (
                <div
                  key={p.id || p.code}
                  className="p-3 rounded-input bg-bg-subtle border border-border flex items-center justify-between"
                >
                  <div className="min-w-0 pr-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-semibold text-text-muted">{p.code}</span>
                      <span className="text-xs font-semibold text-text truncate">{p.name}</span>
                    </div>
                    <div className="text-[11px] text-text-faint mt-0.5">
                      Lead: {p.lead} &bull; {p.tasksCount || 6} tasks &bull; {p.teammates || 4} members
                    </div>
                  </div>

                  <Badge
                    variant={p.health === 'ON_TRACK' ? 'success' : p.health === 'AT_RISK' ? 'warning' : 'danger'}
                    dot
                  >
                    {p.health === 'ON_TRACK' ? 'On track' : p.health === 'AT_RISK' ? 'At risk' : 'Delayed'}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>

          {/* 2. Calendar Strip & Next Meeting */}
          <Card className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-text-muted" strokeWidth={1.5} />
                <h2 className="text-base font-semibold text-text tracking-tight">Calendar</h2>
              </div>
              <span className="text-xs text-text-faint">November 2026</span>
            </div>

            {/* Horizontal Day Selector Strip */}
            <div className="flex items-center justify-between gap-1.5">
              <button className="p-1 rounded text-text-faint hover:text-text hover:bg-bg-subtle" aria-label="Previous day">
                <ChevronLeft className="w-4 h-4" strokeWidth={1.5} />
              </button>

              <div className="grid grid-cols-7 gap-1.5 flex-1">
                {calendarDays.map((d) => {
                  const isSelected = selectedDay === d.date;
                  return (
                    <button
                      key={d.date}
                      type="button"
                      onClick={() => setSelectedDay(d.date)}
                      className={`flex flex-col items-center py-2 px-1 rounded-input border transition ${
                        isSelected
                          ? 'bg-accent text-accent-fg border-accent font-semibold'
                          : 'bg-surface border-border text-text-muted hover:border-border-strong'
                      }`}
                    >
                      <span className="text-[10px] uppercase">{d.day}</span>
                      <span className="text-xs font-semibold tabular-nums mt-0.5">{d.date}</span>
                    </button>
                  );
                })}
              </div>

              <button className="p-1 rounded text-text-faint hover:text-text hover:bg-bg-subtle" aria-label="Next day">
                <ChevronRight className="w-4 h-4" strokeWidth={1.5} />
              </button>
            </div>

            {/* Next Scheduled Meeting Card */}
            <div className="p-3.5 rounded-input bg-bg-subtle border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="text-xs font-semibold text-text">
                  Architecture Review with Lead (Karthik Swaminathan)
                </div>
                <div className="text-[11px] text-text-muted">
                  Today &bull; 11:00 - 11:30 AM &bull; Platform Architecture Sync
                </div>
                <div className="inline-flex items-center gap-1.5 text-[11px] text-text font-semibold px-2 py-0.5 rounded border border-border bg-surface mt-1">
                  <Video className="w-3 h-3 text-status-danger" strokeWidth={1.5} />
                  <span>Google Meet</span>
                </div>
              </div>

              {/* Attendee Avatar Stack */}
              <div className="flex items-center -space-x-1.5 self-start sm:self-auto">
                <div className="w-6 h-6 rounded bg-border text-text text-[10px] font-semibold flex items-center justify-center border border-surface" title="Karthik Swaminathan">
                  KS
                </div>
                <div className="w-6 h-6 rounded bg-border text-text text-[10px] font-semibold flex items-center justify-center border border-surface" title="Yuvraj V">
                  YV
                </div>
                <div className="w-6 h-6 rounded bg-border text-text text-[10px] font-semibold flex items-center justify-center border border-surface" title="Anita Rao">
                  AR
                </div>
              </div>
            </div>
          </Card>

          {/* 3. Reminders Checklist */}
          <Card className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h2 className="text-base font-semibold text-text tracking-tight">Reminders</h2>
              <span className="text-xs text-text-faint tabular-nums">{reminders.length} items</span>
            </div>

            <div className="space-y-1.5">
              {reminders.map((r) => (
                <div
                  key={r.id}
                  className="flex items-center justify-between p-2 rounded-input hover:bg-bg-subtle transition text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0 pr-2">
                    <button
                      type="button"
                      onClick={() => onToggleReminder(r.id)}
                      className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition ${
                        r.done
                          ? 'bg-status-success border-status-success text-white'
                          : 'border-border-strong hover:border-text'
                      }`}
                      aria-label="Toggle reminder"
                    >
                      {r.done && <Check className="w-3 h-3" strokeWidth={1.5} />}
                    </button>
                    <span className={`truncate ${r.done ? 'line-through text-text-faint' : 'text-text'}`}>
                      {r.text}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-text-faint shrink-0">
                    <button
                      type="button"
                      onClick={() => onDeleteReminder(r.id)}
                      className="hover:text-status-danger p-0.5"
                      aria-label="Delete reminder"
                    >
                      <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* RIGHT COLUMN (5 COLS): My Tasks, Goals & Milestones, Sprint Velocity Chart */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* 4. My Tasks Card (priority dot + due time) */}
          <Card className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-text-muted" strokeWidth={1.5} />
                <h2 className="text-base font-semibold text-text tracking-tight">My Tasks</h2>
              </div>
              <button onClick={() => onNavigate('kanban')} className="text-xs text-text-muted hover:text-text">
                Board &rarr;
              </button>
            </div>

            <div className="space-y-2">
              {(myTasks.length > 0 ? myTasks.slice(0, 4) : tasks.slice(0, 4)).map((t) => {
                const dotColor =
                  t.priority === 'CRITICAL' || t.priority === 'HIGH'
                    ? 'bg-status-danger'
                    : t.priority === 'MEDIUM'
                    ? 'bg-status-warning'
                    : 'bg-text-faint';

                return (
                  <div
                    key={t.id || t.code}
                    className="p-3 rounded-input bg-bg-subtle border border-border space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
                        <span className="font-semibold text-text truncate max-w-[200px]">{t.title}</span>
                      </div>
                      <span className="text-[11px] font-mono text-text-faint">{t.points || 4}h effort</span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-text-muted pt-1 border-t border-border">
                      <span className="tabular-nums">{t.date || 'Today · 10:00 AM'}</span>
                      <span className="font-semibold text-text">{t.status}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* 5. Goals and Milestones (dynamic colored progress bars) */}
          <Card className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <div className="flex items-center gap-2">
                <Flag className="w-4 h-4 text-indigo-500" strokeWidth={1.5} />
                <h2 className="text-base font-semibold text-text tracking-tight">Goals &amp; Milestones</h2>
              </div>
              <button onClick={() => onNavigate('milestones')} className="text-xs text-text-muted hover:text-text">
                Roadmap &rarr;
              </button>
            </div>

            <div className="space-y-3">
              {milestones.slice(0, 4).map((m) => {
                const variant = m.progress >= 75 ? 'success' : m.progress >= 40 ? 'info' : 'warning';
                return (
                  <div key={m.id} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-text truncate pr-2">{m.title}</span>
                      <span className={`font-bold tabular-nums ${
                        m.progress >= 75 ? 'text-emerald-600 dark:text-emerald-400' : m.progress >= 40 ? 'text-blue-600 dark:text-blue-400' : 'text-amber-600 dark:text-amber-400'
                      }`}>
                        {m.progress}%
                      </span>
                    </div>
                    <ProgressBar value={m.progress} variant={variant} />
                    <div className="text-[10px] text-text-faint tabular-nums flex justify-between">
                      <span>Owner: {m.owner || 'Platform Team'}</span>
                      <span>Target: {m.targetDate}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* 6. Sprint Velocity Chart (Dual-line: actual in royal blue, target in amber dashed) */}
          <Card className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-border">
              <div>
                <h2 className="text-base font-semibold text-text tracking-tight">Sprint Velocity</h2>
                <span className="text-[11px] text-text-muted">Effort burned vs 40h squad commitment</span>
              </div>
              <div className="flex items-center gap-2 text-[10px]">
                <span className="flex items-center gap-1 font-semibold text-blue-600 dark:text-blue-400">
                  <span className="w-2.5 h-0.5 bg-blue-600 rounded-full inline-block" /> Actual
                </span>
                <span className="flex items-center gap-1 font-semibold text-amber-500">
                  <span className="w-2.5 h-0.5 border-b border-amber-500 border-dashed inline-block" /> Target (40h)
                </span>
              </div>
            </div>

            <div className="h-44 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={velocityData} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis
                    dataKey="sprint"
                    tick={{ fill: 'var(--text-faint)', fontSize: 10 }}
                    axisLine={{ stroke: 'var(--border)' }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: 'var(--text-faint)', fontSize: 10 }}
                    axisLine={{ stroke: 'var(--border)' }}
                    tickLine={false}
                    domain={[0, 50]}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--surface)',
                      borderColor: 'var(--border-strong)',
                      borderRadius: '8px',
                      fontSize: '11px',
                      color: 'var(--text)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    }}
                  />
                  {/* Amber target benchmark dashed line */}
                  <Line
                    type="monotone"
                    dataKey="target"
                    name="Target"
                    stroke="#f59e0b"
                    strokeWidth={1.5}
                    strokeDasharray="4 4"
                    dot={false}
                  />
                  {/* Vibrant blue actual burned velocity line */}
                  <Line
                    type="monotone"
                    dataKey="points"
                    name="Delivered"
                    stroke="#2563eb"
                    strokeWidth={2}
                    dot={{ r: 3.5, fill: '#2563eb' }}
                    activeDot={{ r: 5, fill: '#1d4ed8' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

        </div>

      </div>
    </div>
  );
}

