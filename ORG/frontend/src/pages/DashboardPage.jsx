import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ProgressBar } from '../components/ui/ProgressBar';
import { 
  FolderKanban, 
  CheckSquare, 
  Flag, 
  Check, 
  Trash2, 
  CheckCircle2,
  Clock,
  AlertTriangle,
  Zap,
  ShieldCheck,
  Users,
  Activity,
  Plus,
  ArrowUpRight,
  TrendingUp
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export function DashboardPage({
  projects = [],
  tasks = [],
  milestones = [],
  workload = [],
  reminders = [],
  onToggleReminder,
  onDeleteReminder,
  onOpenNewTask,
  onOpenNewProject,
  onNavigate,
  onUpdateTaskStatus,
}) {
  const { user } = useAuth();
  const { addToast } = useToast();

  const currentHour = new Date().getHours();
  const greetingTime = currentHour < 12 ? 'Good morning' : currentHour < 17 ? 'Good afternoon' : 'Good evening';
  const firstName = user?.name ? user.name.split(' ')[0] : 'Engineer';
  const todayDateFormatted = new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date());

  // Sprint velocity data for smooth AreaChart
  const velocityData = [
    { sprint: 'Sprint 21', points: 34, target: 40 },
    { sprint: 'Sprint 22', points: 38, target: 40 },
    { sprint: 'Sprint 23', points: 42, target: 40 },
    { sprint: 'Sprint 24', points: 39, target: 40 },
    { sprint: 'Sprint 25', points: 36, target: 40 },
  ];

  // Active user's tasks
  const myTasks = tasks.filter((t) => {
    if (!t.assignee) return false;
    return t.assignee.toLowerCase().includes(firstName.toLowerCase());
  });

  // Dynamic portfolio & sprint metrics with fallback defaults
  const projectCount = projects.length || 24;
  const atRiskCount = projects.filter((p) => p.health === 'AT_RISK').length || 4;
  const avgProgress = projects.length
    ? Math.round(projects.reduce((acc, p) => acc + (p.progress || 0), 0) / projects.length)
    : 85;

  const totalTasksCount = tasks.length || 186;
  const doneTasksCount = tasks.filter((t) => t.status === 'DONE').length;
  const donePercent = tasks.length
    ? Math.round((doneTasksCount / tasks.length) * 100)
    : 88;

  // Dynamic squad workload calculations
  const squadAllocatedHours = workload.reduce((acc, dev) => {
    const pts = dev.activePoints ?? dev.points ?? 0;
    return acc + (pts * 4);
  }, 0) || 36;
  const squadCapacityHours = (workload.length || 1) * 40;
  const squadUtilization = Math.round((squadAllocatedHours / squadCapacityHours) * 100);
  const squadBufferHours = Math.max(0, squadCapacityHours - squadAllocatedHours);

  // Cycle status on click
  const handleCycleTaskStatus = (task) => {
    const statusCycle = {
      'TODO': 'IN_PROGRESS',
      'IN_PROGRESS': 'REVIEW',
      'REVIEW': 'DONE',
      'DONE': 'TODO',
    };
    const nextStatus = statusCycle[task.status] || 'IN_PROGRESS';
    if (onUpdateTaskStatus) {
      onUpdateTaskStatus(task.id, nextStatus);
    }
    addToast(`Task ${task.code} transitioned to ${nextStatus}`, 'info');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* macOS Style Top Hero Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-text-muted">
            <span className="font-semibold text-text">{todayDateFormatted}</span>
            <span className="text-text-faint">&bull;</span>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold text-[11px] border border-blue-500/20">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-500" />
              </span>
              Sprint 25 Active
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-text">
            {`${greetingTime}, ${firstName}`}
          </h1>
        </div>

        {/* macOS Action Buttons */}
        <div className="flex items-center gap-2.5">
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={onOpenNewProject}
            className="shadow-2xs rounded-xl"
          >
            <FolderKanban className="w-3.5 h-3.5 mr-1 text-text-muted" strokeWidth={1.8} />
            <span>New Project</span>
          </Button>
          <Button 
            variant="primary" 
            size="sm" 
            onClick={onOpenNewTask}
            className="shadow-sm rounded-xl bg-blue-600 hover:bg-blue-500 text-white"
          >
            <Plus className="w-3.5 h-3.5 mr-1" strokeWidth={2} />
            <span>New Task</span>
          </Button>
        </div>
      </div>

      {/* 4 Spacious, Decluttered macOS KPI Cards (Replaced the cluttered 8 tight boxes) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Projects KPI */}
        <Card className="p-4 space-y-3 bg-surface/90 hover:border-blue-400/60 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 rounded-2xl border border-border/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-text-muted flex items-center gap-1.5">
              <FolderKanban className="w-4 h-4 text-blue-500" />
              Active Portfolio
            </span>
            <Badge variant="info">{projects.length ? `${projects.length} Total` : '24 Total'}</Badge>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-text tabular-nums tracking-tight">{projectCount}</span>
            <span className="text-xs font-semibold text-amber-500">{atRiskCount} at risk</span>
          </div>
          <div className="pt-1">
            <ProgressBar value={avgProgress} variant="info" />
          </div>
          <div className="text-[11px] text-text-faint flex justify-between">
            <span>Core Banking &amp; Fintech</span>
            <span className="text-blue-600 dark:text-blue-400 font-semibold cursor-pointer" onClick={() => onNavigate('projects')}>View all &rarr;</span>
          </div>
        </Card>

        {/* 2. Tasks KPI */}
        <Card className="p-4 space-y-3 bg-surface/90 hover:border-emerald-400/60 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 rounded-2xl border border-border/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-text-muted flex items-center gap-1.5">
              <CheckSquare className="w-4 h-4 text-emerald-500" />
              Sprint Tasks
            </span>
            <Badge variant="success">{donePercent}% Done</Badge>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-text tabular-nums tracking-tight">{totalTasksCount}</span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              {tasks.length ? `${doneTasksCount} closed` : '+14 closed today'}
            </span>
          </div>
          <div className="pt-1">
            <ProgressBar value={donePercent} variant="success" />
          </div>
          <div className="text-[11px] text-text-faint flex justify-between">
            <span>5 Squads active</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold cursor-pointer" onClick={() => onNavigate('kanban')}>Board &rarr;</span>
          </div>
        </Card>

        {/* 3. Service Desk KPI */}
        <Card className="p-4 space-y-3 bg-surface/90 hover:border-amber-400/60 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 rounded-2xl border border-border/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-text-muted flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-500" />
              SLA Compliance
            </span>
            <Badge variant="warning">98.5%</Badge>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-text tabular-nums tracking-tight">41</span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">0 breaches</span>
          </div>
          <div className="pt-1">
            <ProgressBar value={98.5} variant="warning" />
          </div>
          <div className="text-[11px] text-text-faint flex justify-between">
            <span>Avg response 18m</span>
            <span className="text-amber-600 dark:text-amber-400 font-semibold cursor-pointer" onClick={() => onNavigate('tickets')}>Tickets &rarr;</span>
          </div>
        </Card>

        {/* 4. Squad Capacity KPI */}
        <Card className="p-4 space-y-3 bg-surface/90 hover:border-indigo-400/60 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 rounded-2xl border border-border/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-text-muted flex items-center gap-1.5">
              <Users className="w-4 h-4 text-indigo-500" />
              Squad Bandwidth
            </span>
            <Badge variant="neutral" className="whitespace-nowrap">{squadAllocatedHours}h / {squadCapacityHours}h</Badge>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-text tabular-nums tracking-tight">{squadUtilization}%</span>
            <span className="text-xs font-semibold text-text-muted">{squadBufferHours}h buffer</span>
          </div>
          <div className="pt-1">
            <ProgressBar value={squadUtilization} variant={squadUtilization > 100 ? 'danger' : 'accent'} />
          </div>
          <div className="text-[11px] text-text-faint flex justify-between">
            <span>{workload.length || 4} engineers</span>
            <span className="text-indigo-600 dark:text-indigo-400 font-semibold cursor-pointer" onClick={() => onNavigate('workload')}>Squads &rarr;</span>
          </div>
        </Card>
      </div>

      {/* Clean Dual-Panel Workspace (Spacious, Breathable Layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN (7 COLS): Sprint Velocity Chart + Active Projects Portfolio */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* 1. Expansive Sprint Velocity Area Chart */}
          <Card className="p-5 rounded-2xl border border-border/80 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border/60">
              <div>
                <h3 className="text-sm font-bold text-text tracking-tight flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                  Sprint 25 Velocity &amp; Burnup Trend
                </h3>
                <p className="text-xs text-text-muted mt-0.5">
                  Actual effort burned vs. 40h weekly squad target threshold
                </p>
              </div>

              <div className="flex items-center gap-3 text-xs font-semibold">
                <span className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block" /> Delivered (36h)
                </span>
                <span className="flex items-center gap-1.5 text-amber-500">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" /> Commitment (40h)
                </span>
              </div>
            </div>

            <div className="h-56 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={velocityData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="velocityGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis
                    dataKey="sprint"
                    tick={{ fill: 'var(--text-faint)', fontSize: 11 }}
                    axisLine={{ stroke: 'var(--border)' }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: 'var(--text-faint)', fontSize: 11 }}
                    axisLine={{ stroke: 'var(--border)' }}
                    tickLine={false}
                    domain={[0, 50]}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--surface)',
                      borderColor: 'var(--border-strong)',
                      borderRadius: '12px',
                      fontSize: '12px',
                      color: 'var(--text)',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="points"
                    name="Hours Burned"
                    stroke="#2563EB"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#velocityGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* 2. Active Projects Portfolio Table (Clean & Decluttered) */}
          <Card className="p-5 rounded-2xl border border-border/80 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border/60">
              <div className="flex items-center gap-2">
                <FolderKanban className="w-4 h-4 text-text-muted" strokeWidth={1.8} />
                <h3 className="text-sm font-bold text-text tracking-tight">Active Projects Portfolio</h3>
              </div>
              <button
                onClick={() => onNavigate('projects')}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
              >
                All Projects &rarr;
              </button>
            </div>

            <div className="space-y-2.5">
              {projects.slice(0, 4).map((p) => {
                const healthVariant =
                  p.health === 'ON_TRACK' ? 'success' : p.health === 'AT_RISK' ? 'warning' : 'danger';
                return (
                  <div
                    key={p.id || p.code}
                    className="p-3.5 rounded-xl bg-bg-subtle/70 hover:bg-bg-subtle border border-border/60 flex items-center justify-between transition-all duration-200"
                  >
                    <div className="min-w-0 pr-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-md bg-blue-500/10">
                          {p.code}
                        </span>
                        <span className="text-xs font-bold text-text truncate">{p.name}</span>
                      </div>
                      <div className="text-[11px] text-text-faint mt-1 flex items-center gap-2">
                        <span>Lead: <strong className="text-text font-medium">{p.lead}</strong></span>
                        <span>&bull;</span>
                        <span>Due {p.dueDate}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="w-24 hidden sm:block">
                        <div className="flex justify-between text-[10px] text-text-faint mb-1">
                          <span>Progress</span>
                          <span className="font-bold text-text">{p.progress}%</span>
                        </div>
                        <ProgressBar value={p.progress} variant={healthVariant} />
                      </div>
                      <Badge variant={healthVariant} dot>
                        {p.health === 'ON_TRACK' ? 'On track' : p.health === 'AT_RISK' ? 'At risk' : 'Delayed'}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* RIGHT COLUMN (5 COLS): My Active Tasks & Reminders Checklist */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* 3. My Active Tasks with 1-Click Status Transitions */}
          <Card className="p-5 rounded-2xl border border-border/80 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border/60">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-text-muted" strokeWidth={1.8} />
                <h3 className="text-sm font-bold text-text tracking-tight">My Active Tasks</h3>
              </div>
              <button 
                onClick={() => onNavigate('kanban')} 
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
              >
                Kanban &rarr;
              </button>
            </div>

            <div className="space-y-2.5">
              {(myTasks.length > 0 ? myTasks.slice(0, 4) : tasks.slice(0, 4)).map((t) => {
                const dotColor =
                  t.priority === 'CRITICAL' || t.priority === 'HIGH'
                    ? 'bg-rose-500'
                    : t.priority === 'MEDIUM'
                    ? 'bg-amber-500'
                    : 'bg-slate-400';

                return (
                  <div
                    key={t.id || t.code}
                    className="p-3.5 rounded-xl bg-bg-subtle/70 hover:bg-bg-subtle border border-border/60 space-y-2 transition-all duration-200"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${dotColor}`} />
                        <span className="font-bold text-text truncate max-w-[200px]">{t.title}</span>
                      </div>
                      <span className="text-[11px] font-mono text-text-faint px-2 py-0.5 rounded-md bg-surface border border-border/60 font-semibold">
                        {t.points || 4}h effort
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-text-muted pt-1 border-t border-border/50">
                      <span className="tabular-nums flex items-center gap-1">
                        <Clock className="w-3 h-3 text-text-faint" />
                        {t.dueDate || '14 Nov'}
                      </span>
                      
                      {/* Interactive macOS status button */}
                      <button
                        type="button"
                        onClick={() => handleCycleTaskStatus(t)}
                        title="Click to cycle status"
                        className={`font-bold px-2.5 py-0.5 rounded-lg text-[10px] cursor-pointer transition-all duration-150 active:scale-95 shadow-2xs ${
                          t.status === 'DONE'
                            ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                            : t.status === 'IN_PROGRESS'
                            ? 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30'
                            : 'bg-surface text-text border border-border'
                        }`}
                      >
                        {t.status} &bull; Advance &rarr;
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* 4. Interactive Reminders Checklist */}
          <Card className="p-5 rounded-2xl border border-border/80 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border/60">
              <h3 className="text-sm font-bold text-text tracking-tight flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Reminders &amp; Quick Checklist
              </h3>
              <span className="text-xs text-text-faint tabular-nums font-semibold">{reminders.length} items</span>
            </div>

            <div className="space-y-2">
              {reminders.map((r) => (
                <div
                  key={r.id}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-bg-subtle transition-all duration-150 text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0 pr-2">
                    <button
                      type="button"
                      onClick={() => onToggleReminder(r.id)}
                      className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 transition-all duration-150 ${
                        r.done
                          ? 'bg-emerald-500 border-emerald-500 text-white'
                          : 'border-border-strong hover:border-text bg-surface'
                      }`}
                      aria-label="Toggle reminder"
                    >
                      {r.done && <Check className="w-3 h-3" strokeWidth={2} />}
                    </button>
                    <span className={`truncate text-xs ${r.done ? 'line-through text-text-faint' : 'text-text font-medium'}`}>
                      {r.text}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => onDeleteReminder(r.id)}
                    className="text-text-faint hover:text-rose-500 p-1 transition-colors"
                    aria-label="Delete reminder"
                  >
                    <Trash2 className="w-3.5 h-3.5" strokeWidth={1.8} />
                  </button>
                </div>
              ))}
            </div>
          </Card>

        </div>

      </div>
    </div>
  );
}
