import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Badge } from '../components/ui/Badge';
import { Plus, MessageSquare, Send, Calendar, Clock, User, ArrowRight, X } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

const COLUMNS = [
  { id: 'BACKLOG', label: 'Backlog' },
  { id: 'TODO', label: 'To Do' },
  { id: 'IN_PROGRESS', label: 'In Progress' },
  { id: 'REVIEW', label: 'Review' },
  { id: 'DONE', label: 'Done' },
];

export function KanbanPage({ tasks, onMoveTask, onCreateTask, onAddComment }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [commentText, setCommentText] = useState('');
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

    // Keep drawer in sync
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
    addToast('Comment added to task discussion', 'info');
  };

  const getPriorityDot = (prio) => {
    switch (prio) {
      case 'CRITICAL':
      case 'HIGH':
        return 'bg-status-danger';
      case 'MEDIUM':
        return 'bg-status-warning';
      case 'LOW':
      default:
        return 'bg-text-faint';
    }
  };

  const getInitials = (name) => {
    if (!name) return 'EM';
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-text">Tasks</h1>
          <p className="text-xs text-text-muted mt-0.5">
            Agile Kanban board &bull; Estimated effort hours &bull; Team collaboration &bull; Sprint execution
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} size="sm">
          <Plus className="w-4 h-4" strokeWidth={1.5} />
          <span>New task</span>
        </Button>
      </div>

      {/* Active Sprint Cycle & Progress Banner (PDF Section 6.4) */}
      <div className="p-4 rounded-card bg-bg-subtle border border-border flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-accent px-2 py-0.5 rounded bg-surface border border-border">
              SPR-25
            </span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-surface text-text-muted border border-border">
              v1.2.0-RC1
            </span>
            <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-status-success-bg text-status-success">
              Active cycle
            </span>
          </div>
          <h3 className="text-xs font-semibold text-text">
            Sprint Cycle 25: Enterprise Platform Core &amp; Service Desk SLA
          </h3>
          <p className="text-[11px] text-text-muted">
            Scope: Complete SLA Warning Engine, Task Collaboration stream, and Pure JPA entity mappings.
          </p>
        </div>

        <div className="w-full md:w-64 space-y-1.5 self-start md:self-auto">
          <div className="flex items-center justify-between text-xs text-text-muted">
            <span>Cycle Effort</span>
            <span className="font-semibold text-text tabular-nums">56 / 88 hrs (64%)</span>
          </div>
          <div className="w-full bg-border rounded-full h-1.5 overflow-hidden">
            <div className="bg-accent h-1.5 rounded-full" style={{ width: '64%' }} />
          </div>
          <div className="text-[10px] text-text-faint flex justify-between">
            <span>Start: 27 Oct</span>
            <span>Ends: 10 Nov</span>
          </div>
        </div>
      </div>

      {/* 5 Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5 items-start">
        {COLUMNS.map((col) => {
          const colTasks = tasks.filter((t) => t.status === col.id);
          const colHours = colTasks.reduce((acc, t) => acc + (t.points || 4), 0);

          return (
            <div key={col.id} className="bg-bg-subtle border border-border rounded-card p-3 flex flex-col min-h-[560px]">
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 mb-2 border-b border-border">
                <span className="text-xs font-medium text-text">
                  {col.label}
                </span>
                <span className="text-xs text-text-muted tabular-nums font-semibold">
                  {colTasks.length} &bull; {colHours}h
                </span>
              </div>

              {/* Tasks List */}
              <div className="space-y-2 flex-1 overflow-y-auto">
                {colTasks.length === 0 ? (
                  <div className="py-8 text-center text-xs text-text-faint">No tasks</div>
                ) : (
                  colTasks.map((t) => {
                    const commentsCount = t.comments ? t.comments.length : 0;
                    return (
                      <div
                        key={t.id || t.code}
                        onClick={() => setSelectedTask(t)}
                        className="bg-surface border border-border hover:border-accent cursor-pointer rounded-input p-3 space-y-2.5 transition text-left"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <span className={`w-1.5 h-1.5 rounded-full ${getPriorityDot(t.priority)}`} />
                            <span className="font-mono text-[11px] text-text-faint font-semibold">{t.code}</span>
                          </div>
                          <span className="text-[11px] font-medium text-text-muted tabular-nums bg-bg-subtle px-1.5 py-0.5 rounded border border-border">
                            {t.points || 4}h effort
                          </span>
                        </div>

                        <h4 className="text-xs font-semibold text-text leading-snug line-clamp-2">
                          {t.title}
                        </h4>

                        <div className="flex items-center justify-between pt-2 border-t border-border text-[11px] text-text-muted">
                          <span className="truncate max-w-[110px] font-medium">{t.assignee}</span>

                          <div className="flex items-center gap-2 text-text-faint">
                            {commentsCount > 0 && (
                              <span className="flex items-center gap-1 text-[10px] text-accent font-semibold" title={`${commentsCount} comments`}>
                                <MessageSquare className="w-3 h-3" strokeWidth={1.5} />
                                <span>{commentsCount}</span>
                              </span>
                            )}
                            <span className="text-[10px] text-text-muted">Details &rarr;</span>
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

      {/* Task Collaboration & Discussion Drawer / Modal (PDF Section 6.4 & 6.5) */}
      {selectedTask && (
        <Modal
          isOpen={Boolean(selectedTask)}
          onClose={() => setSelectedTask(null)}
          title={`Task Discussion & Details: ${selectedTask.code}`}
        >
          <div className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
            {/* Task Overview */}
            <div className="space-y-2 pb-3 border-b border-border">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${getPriorityDot(selectedTask.priority)}`} />
                  <span className="font-mono text-xs font-bold text-text">{selectedTask.code}</span>
                  <Badge variant="outline">{selectedTask.priority} Priority</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-text-muted">Status:</span>
                  <select
                    value={selectedTask.status}
                    onChange={(e) => {
                      const newStatus = e.target.value;
                      onMoveTask(selectedTask.id, newStatus);
                      setSelectedTask((prev) => ({ ...prev, status: newStatus }));
                      addToast(`Status updated to ${newStatus}`, 'success');
                    }}
                    className="px-2 py-1 bg-surface border border-border rounded text-xs text-text font-medium outline-hidden"
                  >
                    {COLUMNS.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <h2 className="text-base font-semibold text-text leading-snug">
                {selectedTask.title}
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-xs">
                <div className="p-2 rounded bg-bg-subtle border border-border">
                  <div className="text-[10px] text-text-muted flex items-center gap-1">
                    <User className="w-3 h-3" /> Assignee
                  </div>
                  <div className="font-semibold text-text truncate mt-0.5">{selectedTask.assignee}</div>
                </div>

                <div className="p-2 rounded bg-bg-subtle border border-border">
                  <div className="text-[10px] text-text-muted flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Effort
                  </div>
                  <div className="font-semibold text-text mt-0.5">{selectedTask.points || 4} hours</div>
                </div>

                <div className="p-2 rounded bg-bg-subtle border border-border">
                  <div className="text-[10px] text-text-muted flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Due Date
                  </div>
                  <div className="font-semibold text-text mt-0.5">{selectedTask.dueDate || '2026-11-20'}</div>
                </div>

                <div className="p-2 rounded bg-bg-subtle border border-border">
                  <div className="text-[10px] text-text-muted">Project</div>
                  <div className="font-semibold text-text mt-0.5">{selectedTask.projectCode || 'PRJ-101'}</div>
                </div>
              </div>
            </div>

            {/* Team Collaboration Stream (PDF Section 6.4 & 6.5) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold text-text flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-accent" strokeWidth={1.5} />
                  <span>Team Collaboration Stream</span>
                </h3>
                <span className="text-[11px] text-text-faint">
                  {(selectedTask.comments || []).length} updates
                </span>
              </div>

              {/* Comments History */}
              <div className="space-y-2.5 max-h-56 overflow-y-auto">
                {(!selectedTask.comments || selectedTask.comments.length === 0) ? (
                  <div className="p-4 rounded-input bg-bg-subtle border border-border text-center text-xs text-text-faint">
                    No team comments recorded yet. Add an update or blocker note below.
                  </div>
                ) : (
                  selectedTask.comments.map((c, i) => (
                    <div
                      key={c.id || i}
                      className="p-3 rounded-input bg-bg-subtle border border-border space-y-1.5"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded bg-accent text-accent-fg text-[10px] font-bold flex items-center justify-center">
                            {getInitials(c.author)}
                          </div>
                          <span className="font-semibold text-text">{c.author}</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-surface border border-border text-text-muted">
                            {c.role || 'Member'}
                          </span>
                        </div>
                        <span className="text-[10px] text-text-faint tabular-nums">{c.time || 'Recent'}</span>
                      </div>
                      <p className="text-xs text-text pl-7 leading-relaxed">{c.text || c.content}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Add Comment Input Form */}
              <form onSubmit={handlePostComment} className="pt-2 border-t border-border space-y-2">
                <label className="block text-[11px] font-medium text-text-muted">
                  Post Team Update / Review Note
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Enter update, SLA check, or progress notes..."
                    className="flex-1 px-3 py-2 bg-surface border border-border rounded-input text-xs text-text focus:border-accent outline-hidden"
                  />
                  <Button type="submit" size="sm" disabled={!commentText.trim()}>
                    <Send className="w-3.5 h-3.5" strokeWidth={1.5} />
                    <span>Post</span>
                  </Button>
                </div>
              </form>
            </div>

            {/* Modal Footer Actions */}
            <div className="flex justify-end pt-3 border-t border-border">
              <Button variant="secondary" size="sm" onClick={() => setSelectedTask(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* New Task Modal (De-cluttered and un-slopped) */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Sprint Task">
        <form onSubmit={handleCreate} className="space-y-3.5">
          <div>
            <label className="block text-xs font-medium text-text-muted mb-1">
              Task title
            </label>
            <input
              type="text"
              required
              placeholder="Configure SLA threshold countdown calculations"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-3 py-2 bg-surface border border-border rounded-input text-sm text-text focus:border-accent outline-hidden"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-text-muted mb-1">
                Estimated effort
              </label>
              <select
                value={form.points}
                onChange={(e) => setForm({ ...form, points: parseInt(e.target.value, 10) })}
                className="w-full px-3 py-2 bg-surface border border-border rounded-input text-sm text-text focus:border-accent outline-hidden"
              >
                <option value={4}>4h (Half Day)</option>
                <option value={8}>8h (1 Full Day)</option>
                <option value={16}>16h (2 Days)</option>
                <option value={24}>24h (3 Days)</option>
                <option value={40}>40h (1 Week)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-text-muted mb-1">
                Priority
              </label>
              <select
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}
                className="w-full px-3 py-2 bg-surface border border-border rounded-input text-sm text-text focus:border-accent outline-hidden"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">Critical</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-text-muted mb-1">
                Assignee
              </label>
              <input
                type="text"
                required
                value={form.assignee}
                onChange={(e) => setForm({ ...form, assignee: e.target.value })}
                className="w-full px-3 py-2 bg-surface border border-border rounded-input text-sm text-text focus:border-accent outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-text-muted mb-1">
                Due Date
              </label>
              <input
                type="date"
                required
                value={form.dueDate}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                className="w-full px-3 py-2 bg-surface border border-border rounded-input text-sm text-text focus:border-accent outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-text-muted mb-1">
                Project Code
              </label>
              <input
                type="text"
                required
                value={form.projectCode}
                onChange={(e) => setForm({ ...form, projectCode: e.target.value })}
                className="w-full px-3 py-2 bg-surface border border-border rounded-input text-sm text-text focus:border-accent outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-text-muted mb-1">
                Initial Column
              </label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full px-3 py-2 bg-surface border border-border rounded-input text-sm text-text focus:border-accent outline-hidden"
              >
                {COLUMNS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-border">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Create task</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
