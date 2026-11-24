import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Badge } from '../components/ui/Badge';
import { Plus, MessageSquare, Send, Calendar, Clock, User, ArrowRight, X, Search, Filter } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

const COLUMNS = [
  { id: 'BACKLOG', label: 'Backlog' },
  { id: 'TODO', label: 'To Do' },
  { id: 'IN_PROGRESS', label: 'In Progress' },
  { id: 'REVIEW', label: 'In Review' },
  { id: 'DONE', label: 'Completed' },
];

export function KanbanPage({ tasks = [], onMoveTask, onCreateTask, onAddComment }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [assigneeFilter, setAssigneeFilter] = useState('ALL');
  const { user } = useAuth();
  const { addToast } = useToast();

  const [form, setForm] = useState({
    title: '',
    points: 8,
    priority: 'MEDIUM',
    assignee: user?.name || 'Yuvraj V',
    status: 'TODO',
    projectCode: 'PRJ-101',
    dueDate: '2026-11-20',
    description: '',
  });

  const handleCreate = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    const code = `TSK-${Math.floor(100 + Math.random() * 900)}`;
    onCreateTask({
      ...form,
      code,
      id: Date.now(),
      date: 'Today · Just now',
      comments: [],
    });
    addToast(`Task ${code} created`, 'success');
    setIsModalOpen(false);
    setForm({
      title: '',
      points: 8,
      priority: 'MEDIUM',
      assignee: user?.name || 'Yuvraj V',
      status: 'TODO',
      projectCode: 'PRJ-101',
      dueDate: '2026-11-20',
      description: '',
    });
  };

  const handlePostComment = (e) => {
    e.preventDefault();
    if (!commentText.trim() || !selectedTask) return;
    const authorName = user?.name || 'Yuvraj V';
    const authorRole = user?.role ? user.role.replace('ROLE_', '').replace('_', ' ') : 'Software Engineer';
    
    if (onAddComment) {
      onAddComment(selectedTask.id, {
        author: authorName,
        role: authorRole,
        text: commentText.trim(),
      });
    }

    const newComment = {
      id: Date.now(),
      author: authorName,
      role: authorRole,
      text: commentText.trim(),
      time: 'Just now',
    };

    setSelectedTask((prev) => ({
      ...prev,
      comments: [...(prev.comments || []), newComment],
    }));

    setCommentText('');
    addToast('Comment added to discussion', 'info');
  };

  const getPriorityDot = (prio) => {
    switch (prio) {
      case 'CRITICAL':
      case 'HIGH':
        return 'bg-rose-500';
      case 'MEDIUM':
        return 'bg-amber-500';
      case 'LOW':
      default:
        return 'bg-blue-400';
    }
  };

  // Dynamic cycle burn metrics and filter derivations
  const totalSprintHours = tasks.reduce((acc, t) => acc + ((t.points || 2) * 4), 0) || 88;
  const doneSprintHours = tasks.filter((t) => t.status === 'DONE').reduce((acc, t) => acc + ((t.points || 2) * 4), 0) || 56;
  const burnPercent = totalSprintHours > 0 ? Math.min(100, Math.round((doneSprintHours / totalSprintHours) * 100)) : 64;

  const assignees = Array.from(new Set(tasks.map((t) => t.assignee).filter(Boolean)));

  const filteredTasks = tasks.filter((t) => {
    const matchSearch =
      (t.title && t.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (t.code && t.code.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchPriority = priorityFilter === 'ALL' || t.priority === priorityFilter;
    const matchAssignee = assigneeFilter === 'ALL' || t.assignee === assigneeFilter;
    return matchSearch && matchPriority && matchAssignee;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text">Tasks &amp; Kanban</h1>
          <p className="text-xs text-text-muted mt-0.5">
            Agile Kanban board &bull; Estimated effort hours &bull; Live team collaboration &bull; Sprint execution
          </p>
        </div>
        <Button 
          onClick={() => setIsModalOpen(true)} 
          size="sm"
          className="rounded-xl shadow-sm bg-blue-600 hover:bg-blue-500 text-white"
        >
          <Plus className="w-3.5 h-3.5 mr-1" strokeWidth={2} />
          <span>New Task</span>
        </Button>
      </div>

      {/* macOS Style Sprint Cycle Banner */}
      <div className="p-4 rounded-2xl bg-surface/85 backdrop-blur-md border border-border/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-lg bg-blue-500/10">
              SPR-26
            </span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-lg bg-bg-subtle text-text-muted border border-border/60">
              v1.3.0
            </span>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              Active Cycle
            </span>
          </div>
          <h3 className="text-xs font-bold text-text">
            Sprint Cycle 26: Executive Analytics &amp; Platform Release
          </h3>
          <p className="text-[11px] text-text-muted">
            Scope: Production Analytics, SLA Compliance Monitoring, and Multi-Squad Workload Rebalancing.
          </p>
        </div>

        <div className="w-full md:w-64 space-y-1.5 self-start md:self-auto">
          <div className="flex items-center justify-between text-xs text-text-muted">
            <span>Cycle Effort Burn</span>
            <span className="font-bold text-text tabular-nums">{doneSprintHours} / {totalSprintHours} hrs ({burnPercent}%)</span>
          </div>
          <div className="w-full bg-border/60 rounded-full h-2 overflow-hidden">
            <div className="bg-blue-600 h-2 rounded-full transition-all duration-300" style={{ width: `${burnPercent}%` }} />
          </div>
          <div className="text-[10px] text-text-faint flex justify-between font-medium">
            <span>Start: 24 Nov 2026</span>
            <span>Ends: 08 Dec 2026</span>
          </div>
        </div>
      </div>

      {/* Search & Priority Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-surface/80 backdrop-blur-md border border-border/80 rounded-2xl shadow-xs">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-text-faint absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-bg-subtle/70 border border-border/60 rounded-xl text-xs text-text focus:border-accent outline-hidden w-52 transition-colors"
            />
          </div>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-1.5 bg-bg-subtle/70 border border-border/60 rounded-xl text-xs text-text focus:border-accent outline-hidden transition-colors font-medium"
          >
            <option value="ALL">All Priorities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>

          {assignees.length > 0 && (
            <select
              value={assigneeFilter}
              onChange={(e) => setAssigneeFilter(e.target.value)}
              className="px-3 py-1.5 bg-bg-subtle/70 border border-border/60 rounded-xl text-xs text-text focus:border-accent outline-hidden transition-colors font-medium"
            >
              <option value="ALL">All Assignees</option>
              {assignees.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          )}
        </div>

        <span className="text-xs text-text-faint font-medium">
          Showing {filteredTasks.length} of {tasks.length} tasks
        </span>
      </div>

      {/* 5 Column Horizontal Kanban Container (Always side-by-side, never vertically stacked) */}
      <div className="overflow-x-auto pb-6 -mx-1 px-1">
        <div className="grid grid-cols-5 gap-4 min-w-[1180px] items-start">
        {COLUMNS.map((col) => {
          const colTasks = filteredTasks.filter((t) => t.status === col.id);
          const colHours = colTasks.reduce((acc, t) => acc + ((t.points || 2) * 4), 0);

          return (
            <div key={col.id} className="bg-bg-subtle/70 backdrop-blur-xs border border-border/70 rounded-2xl p-3.5 flex flex-col min-h-[580px] shadow-2xs">
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 mb-2 border-b border-border/60">
                <span className="text-xs font-bold text-text">
                  {col.label}
                </span>
                <span className="text-[11px] text-text-muted tabular-nums font-mono font-semibold px-1.5 py-0.5 rounded bg-surface border border-border/50">
                  {colTasks.length} &bull; {colHours}h
                </span>
              </div>

              {/* Tasks List */}
              <div className="space-y-2.5 flex-1 overflow-y-auto pr-0.5">
                {colTasks.length === 0 ? (
                  <div className="py-12 text-center text-xs text-text-faint font-medium">No tasks</div>
                ) : (
                  colTasks.map((t) => {
                    const commentsCount = t.comments ? t.comments.length : 0;
                    return (
                      <div
                        key={t.id || t.code}
                        onClick={() => setSelectedTask(t)}
                        className="bg-surface border border-border/70 hover:border-blue-400/60 rounded-xl p-3.5 space-y-2.5 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 cursor-pointer text-left shadow-2xs group"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${getPriorityDot(t.priority)}`} />
                            <span className="font-mono text-[11px] text-blue-600 dark:text-blue-400 font-bold">{t.code}</span>
                          </div>
                          <span className="text-[10px] font-semibold text-text-muted tabular-nums bg-bg-subtle px-1.5 py-0.5 rounded-md border border-border/60">
                            {t.points || 4}h effort
                          </span>
                        </div>

                        <h4 className="text-xs font-bold text-text leading-snug line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {t.title}
                        </h4>

                        <div className="flex items-center justify-between pt-2 border-t border-border/50 text-[11px] text-text-muted">
                          <span className="truncate max-w-[110px] font-medium">{t.assignee}</span>

                          <div className="flex items-center gap-2 text-text-faint">
                            {commentsCount > 0 && (
                              <span className="flex items-center gap-1 text-[10px] text-blue-600 dark:text-blue-400 font-bold" title={`${commentsCount} comments`}>
                                <MessageSquare className="w-3 h-3" strokeWidth={1.8} />
                                <span>{commentsCount}</span>
                              </span>
                            )}
                            <span className="text-[10px] text-text-faint group-hover:text-text font-semibold transition-colors">&rarr;</span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
        </div>
      </div>

      {/* Task Collaboration & Discussion Modal */}
      {selectedTask && (
        <Modal
          isOpen={Boolean(selectedTask)}
          onClose={() => setSelectedTask(null)}
          title={`Task Discussion: ${selectedTask.code}`}
        >
          <div className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
            <div className="p-3.5 bg-bg-subtle/80 rounded-xl border border-border/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-blue-600">{selectedTask.code}</span>
                <Badge variant={selectedTask.priority === 'CRITICAL' || selectedTask.priority === 'HIGH' ? 'danger' : 'neutral'}>
                  {selectedTask.priority}
                </Badge>
              </div>
              <h3 className="text-sm font-bold text-text">{selectedTask.title}</h3>
              <div className="text-xs text-text-muted flex items-center justify-between pt-1">
                <span>Assignee: <strong className="text-text">{selectedTask.assignee}</strong></span>
                <span>Effort: <strong className="text-text tabular-nums">{selectedTask.points || 4}h</strong></span>
              </div>
            </div>

            {/* Comments Thread */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold text-text flex items-center gap-2">
                <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                Live Discussion ({selectedTask.comments ? selectedTask.comments.length : 0})
              </h4>

              <div className="space-y-2 max-h-48 overflow-y-auto">
                {(!selectedTask.comments || selectedTask.comments.length === 0) ? (
                  <p className="text-xs text-text-faint italic py-2">No comments yet. Start the discussion below.</p>
                ) : (
                  selectedTask.comments.map((c) => (
                    <div key={c.id} className="p-2.5 rounded-xl bg-surface border border-border/60 space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-text">{c.author} <span className="font-normal text-text-faint">({c.role})</span></span>
                        <span className="text-[10px] text-text-faint">{c.time || 'recently'}</span>
                      </div>
                      <p className="text-xs text-text leading-relaxed">{c.text || c.content}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Add Comment Input */}
              <form onSubmit={handlePostComment} className="flex gap-2 pt-2">
                <input
                  type="text"
                  placeholder="Type a team update or comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="flex-1 px-3 py-2 bg-surface border border-border rounded-xl text-xs text-text focus:border-accent outline-hidden"
                />
                <Button type="submit" size="sm" className="rounded-xl bg-blue-600 hover:bg-blue-500 text-white">
                  <Send className="w-3 h-3 mr-1" />
                  Send
                </Button>
              </form>
            </div>
          </div>
        </Modal>
      )}

      {/* New Task Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Sprint Task"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-text-muted mb-1">
              Task Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Implement SLA calculation engine"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-3 py-2 bg-surface border border-border rounded-xl text-sm text-text focus:border-accent outline-hidden"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-text-muted mb-1">
                Priority
              </label>
              <select
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}
                className="w-full px-3 py-2 bg-surface border border-border rounded-xl text-sm text-text focus:border-accent outline-hidden"
              >
                <option value="CRITICAL">Critical</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-muted mb-1">
                Effort (Hours)
              </label>
              <input
                type="number"
                min="1"
                max="40"
                value={form.points}
                onChange={(e) => setForm({ ...form, points: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-surface border border-border rounded-xl text-sm text-text focus:border-accent outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-text-muted mb-1">
                Assignee
              </label>
              <input
                type="text"
                required
                value={form.assignee}
                onChange={(e) => setForm({ ...form, assignee: e.target.value })}
                className="w-full px-3 py-2 bg-surface border border-border rounded-xl text-sm text-text focus:border-accent outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-muted mb-1">
                Initial Column
              </label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full px-3 py-2 bg-surface border border-border rounded-xl text-sm text-text focus:border-accent outline-hidden"
              >
                <option value="BACKLOG">Backlog</option>
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="REVIEW">Review</option>
                <option value="DONE">Done</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-border/60">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)} className="rounded-xl">
              Cancel
            </Button>
            <Button type="submit" className="rounded-xl bg-blue-600 hover:bg-blue-500 text-white">
              Create Task
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
