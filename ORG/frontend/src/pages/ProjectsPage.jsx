import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { 
  FolderKanban, 
  Flag, 
  Plus, 
  Search, 
  ChevronRight, 
  Calendar, 
  Users, 
  CheckCircle2, 
  Clock, 
  AlertTriangle 
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

export function ProjectsPage({ 
  projects = [], 
  milestones = [], 
  onCreateProject, 
  onCreateMilestone 
}) {
  const { user } = useAuth();
  const { addToast } = useToast();
  
  const [activeView, setActiveView] = useState('projects');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedProject, setSelectedProject] = useState(null);

  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [projectForm, setProjectForm] = useState({
    code: '',
    name: '',
    lead: user?.name || 'Anita Rao',
    dueDate: '2026-12-15',
    description: '',
    client: 'Enterprise Systems Group'
  });

  const [isMilestoneModalOpen, setIsMilestoneModalOpen] = useState(false);
  const [milestoneForm, setMilestoneForm] = useState({
    title: '',
    projectCode: 'PRJ-101',
    owner: user?.name || 'Yuvraj V',
    targetDate: '2026-12-01',
    progress: 25,
  });

  const handleProjectSubmit = (e) => {
    e.preventDefault();
    if (!projectForm.code.trim() || !projectForm.name.trim()) return;
    
    onCreateProject({
      ...projectForm,
      health: 'ON_TRACK',
      progress: 0,
      tasksCount: 0,
      teammates: 4,
    });
    
    addToast(`Project ${projectForm.code} created successfully`, 'success');
    setIsProjectModalOpen(false);
    setProjectForm({
      code: '',
      name: '',
      lead: user?.name || 'Anita Rao',
      dueDate: '2026-12-15',
      description: '',
      client: 'Enterprise Systems Group'
    });
  };

  const handleMilestoneSubmit = (e) => {
    e.preventDefault();
    if (!milestoneForm.title.trim()) return;

    onCreateMilestone({
      ...milestoneForm,
      id: Date.now(),
      status: 'IN_PROGRESS',
    });

    addToast(`Milestone created for ${milestoneForm.projectCode}`, 'success');
    setIsMilestoneModalOpen(false);
    setMilestoneForm({
      title: '',
      projectCode: selectedProject ? selectedProject.code : 'PRJ-101',
      owner: user?.name || 'Yuvraj V',
      targetDate: '2026-12-01',
      progress: 25,
    });
  };

  const filteredProjects = projects.filter((p) => {
    const matchesSearch = 
      p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.lead?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || p.health === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredMilestones = milestones.filter((m) => {
    return (
      m.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.projectCode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.owner?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text">Projects &amp; Milestones</h1>
          <p className="text-xs text-text-muted mt-0.5">
            Enterprise portfolio &bull; Strategic delivery checkpoints &bull; Target dates &amp; health tracking
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={() => setIsMilestoneModalOpen(true)}
            className="rounded-xl shadow-2xs"
          >
            <Flag className="w-3.5 h-3.5 mr-1 text-blue-600" strokeWidth={1.8} />
            <span>Add Milestone</span>
          </Button>
          <Button 
            variant="primary" 
            size="sm" 
            onClick={() => setIsProjectModalOpen(true)}
            className="rounded-xl shadow-sm bg-blue-600 hover:bg-blue-500 text-white"
          >
            <Plus className="w-3.5 h-3.5 mr-1" strokeWidth={2} />
            <span>New Project</span>
          </Button>
        </div>
      </div>

      {/* macOS Style Segmented Control & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-surface/80 backdrop-blur-md border border-border/80 rounded-2xl shadow-xs">
        {/* macOS Segmented Switcher */}
        <div className="flex items-center gap-1 p-1 bg-bg-subtle/80 rounded-xl border border-border/60 shadow-inner-2xs">
          <button
            type="button"
            onClick={() => setActiveView('projects')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all duration-150 flex items-center gap-2 ${
              activeView === 'projects'
                ? 'bg-surface text-text shadow-xs border border-border/60 font-bold'
                : 'text-text-muted hover:text-text'
            }`}
          >
            <FolderKanban className="w-3.5 h-3.5 text-blue-500" strokeWidth={1.8} />
            <span>Projects ({projects.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveView('milestones')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all duration-150 flex items-center gap-2 ${
              activeView === 'milestones'
                ? 'bg-surface text-text shadow-xs border border-border/60 font-bold'
                : 'text-text-muted hover:text-text'
            }`}
          >
            <Flag className="w-3.5 h-3.5 text-indigo-500" strokeWidth={1.8} />
            <span>Milestones Roadmap ({milestones.length})</span>
          </button>
        </div>

        {/* Search & Health Filter */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-text-faint absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by code, title, lead..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-bg-subtle/70 border border-border/60 rounded-xl text-xs text-text placeholder:text-text-faint outline-hidden w-60 focus:border-accent transition-colors"
            />
          </div>

          {activeView === 'projects' && (
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 bg-bg-subtle/70 border border-border/60 rounded-xl text-xs text-text focus:border-accent outline-hidden transition-colors font-medium"
              aria-label="Filter by project health status"
            >
              <option value="ALL">All Statuses</option>
              <option value="ON_TRACK">On Track</option>
              <option value="AT_RISK">At Risk</option>
              <option value="DELAYED">Delayed</option>
            </select>
          )}
        </div>
      </div>

      {/* VIEW 1: PROJECTS PORTFOLIO */}
      {activeView === 'projects' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProjects.map((p) => {
            const healthVariant =
              p.health === 'ON_TRACK' ? 'success' : p.health === 'AT_RISK' ? 'warning' : 'danger';
            const projMilestones = milestones.filter(
              (m) => m.projectCode === p.code || m.projectId === p.id
            );

            return (
              <Card 
                key={p.id || p.code} 
                className="space-y-4 hover:border-blue-400/60 transition-all duration-300 hover:shadow-md hover:-translate-y-1 cursor-pointer rounded-2xl border border-border/80 p-5 bg-surface"
                onClick={() => setSelectedProject(p)}
              >
                {/* Header Row */}
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                    {p.code}
                  </span>
                  <Badge variant={healthVariant} dot>
                    {p.health === 'ON_TRACK' ? 'On track' : p.health === 'AT_RISK' ? 'At risk' : 'Delayed'}
                  </Badge>
                </div>

                {/* Project Title & Client */}
                <div>
                  <h3 className="text-base font-bold text-text tracking-tight truncate">
                    {p.name}
                  </h3>
                  <p className="text-xs text-text-muted mt-1 flex items-center justify-between">
                    <span>Lead: <strong className="text-text font-semibold">{p.lead}</strong></span>
                    <span className="text-[11px] text-text-faint font-medium">{p.client || 'Enterprise'}</span>
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1.5 pt-2 border-t border-border/60">
                  <div className="flex items-center justify-between text-xs text-text-muted">
                    <span>Sprint progress</span>
                    <span className="font-bold text-text tabular-nums">{p.progress || 0}%</span>
                  </div>
                  <ProgressBar value={p.progress || 0} variant={healthVariant} />
                </div>

                {/* Linked Milestones Indicator */}
                {projMilestones.length > 0 && (
                  <div className="p-2.5 rounded-xl bg-bg-subtle/70 border border-border/50 space-y-1">
                    <div className="text-[10px] font-bold text-text-muted uppercase tracking-wider flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <Flag className="w-3 h-3 text-blue-600" />
                        Milestones ({projMilestones.length})
                      </span>
                      <span className="text-blue-600 dark:text-blue-400 text-[10px] font-semibold">View</span>
                    </div>
                    <div className="text-xs text-text truncate font-medium">
                      {projMilestones[0].title}
                    </div>
                  </div>
                )}

                {/* Footer Metrics */}
                <div className="flex items-center justify-between text-xs text-text-faint pt-1">
                  <span className="flex items-center gap-1 font-medium">
                    <Calendar className="w-3.5 h-3.5" />
                    Due {p.dueDate}
                  </span>
                  <span className="flex items-center gap-1 font-medium">
                    <Users className="w-3.5 h-3.5" />
                    {p.tasksCount || 6} tasks &bull; {p.teammates || 4} members
                  </span>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* VIEW 2: MILESTONES ROADMAP */}
      {activeView === 'milestones' && (
        <Card className="p-0 overflow-hidden rounded-2xl border border-border/80 shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border/70 bg-bg-subtle/70 text-text-muted text-xs h-11">
                  <th className="px-5 font-bold">Milestone Checkpoint</th>
                  <th className="px-4 font-bold">Project</th>
                  <th className="px-4 font-bold">Owner</th>
                  <th className="px-4 font-bold">Target Date</th>
                  <th className="px-4 font-bold">Status</th>
                  <th className="px-5 font-bold w-48 text-right">Progress</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredMilestones.map((m) => (
                  <tr key={m.id} className="h-14 hover:bg-bg-subtle/50 transition-colors">
                    <td className="px-5">
                      <div className="flex items-center gap-2.5">
                        <Flag className="w-4 h-4 text-blue-600 shrink-0" strokeWidth={1.8} />
                        <span className="font-bold text-text text-sm">{m.title}</span>
                      </div>
                    </td>
                    <td className="px-4 font-mono text-xs text-blue-600 dark:text-blue-400 font-semibold">{m.projectCode}</td>
                    <td className="px-4 text-text font-medium">{m.owner}</td>
                    <td className="px-4 text-text-muted tabular-nums">{m.targetDate}</td>
                    <td className="px-4">
                      <Badge variant={m.progress >= 90 ? 'success' : 'info'} dot>
                        {m.status || 'IN_PROGRESS'}
                      </Badge>
                    </td>
                    <td className="px-5 text-right">
                      <div className="space-y-1">
                        <div className="text-xs font-bold text-text tabular-nums">{m.progress}%</div>
                        <ProgressBar value={m.progress} variant={m.progress >= 90 ? 'success' : 'accent'} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* PROJECT DETAILS & LINKED MILESTONES MODAL */}
      {selectedProject && (
        <Modal
          isOpen={Boolean(selectedProject)}
          onClose={() => setSelectedProject(null)}
          title={`Project Overview: ${selectedProject.code} - ${selectedProject.name}`}
        >
          <div className="space-y-4">
            <div className="p-3.5 bg-bg-subtle/80 rounded-xl border border-border/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-text-muted">Lead: <strong className="text-text font-bold">{selectedProject.lead}</strong></span>
                <Badge variant={selectedProject.health === 'ON_TRACK' ? 'success' : 'warning'} dot>
                  {selectedProject.health}
                </Badge>
              </div>
              <div className="text-xs text-text-muted">
                Target Completion: <strong className="text-text tabular-nums">{selectedProject.dueDate}</strong>
              </div>
              <div className="space-y-1 pt-1">
                <div className="flex justify-between text-xs">
                  <span>Sprint Completion</span>
                  <span className="font-bold text-text">{selectedProject.progress}%</span>
                </div>
                <ProgressBar value={selectedProject.progress || 0} variant="accent" />
              </div>
            </div>

            {/* Linked Milestones Section */}
            <div className="space-y-2 pt-2 border-t border-border/60">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase text-text-muted tracking-wider flex items-center gap-1.5">
                  <Flag className="w-3.5 h-3.5 text-blue-600" />
                  Linked Milestones
                </h4>
                <Button 
                  size="xs" 
                  variant="secondary"
                  onClick={() => {
                    setMilestoneForm((prev) => ({ ...prev, projectCode: selectedProject.code }));
                    setIsMilestoneModalOpen(true);
                  }}
                  className="rounded-lg shadow-2xs"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Add Milestone
                </Button>
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto">
                {milestones
                  .filter((m) => m.projectCode === selectedProject.code || m.projectId === selectedProject.id)
                  .map((m) => (
                    <div key={m.id} className="p-2.5 rounded-xl bg-surface border border-border/60 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-text">{m.title}</div>
                        <div className="text-[11px] text-text-faint">Owner: {m.owner} &bull; Target: {m.targetDate}</div>
                      </div>
                      <span className="font-mono font-bold text-blue-600">{m.progress}%</span>
                    </div>
                  ))}
              </div>
            </div>

            <div className="pt-3 border-t border-border/60 flex justify-end">
              <Button size="sm" onClick={() => setSelectedProject(null)} className="rounded-xl">
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* NEW PROJECT MODAL */}
      <Modal 
        isOpen={isProjectModalOpen} 
        onClose={() => setIsProjectModalOpen(false)} 
        title="Create New Enterprise Project"
      >
        <form onSubmit={handleProjectSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-text-muted mb-1">
              Project Code
            </label>
            <input
              type="text"
              required
              placeholder="PRJ-105"
              value={projectForm.code}
              onChange={(e) => setProjectForm({ ...projectForm, code: e.target.value })}
              className="w-full px-3 py-2 bg-surface border border-border rounded-xl text-sm text-text focus:border-accent outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-muted mb-1">
              Project Name
            </label>
            <input
              type="text"
              required
              placeholder="Enterprise Billing & Compliance Service"
              value={projectForm.name}
              onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
              className="w-full px-3 py-2 bg-surface border border-border rounded-xl text-sm text-text focus:border-accent outline-hidden"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-text-muted mb-1">
                Project Lead
              </label>
              <input
                type="text"
                required
                value={projectForm.lead}
                onChange={(e) => setProjectForm({ ...projectForm, lead: e.target.value })}
                className="w-full px-3 py-2 bg-surface border border-border rounded-xl text-sm text-text focus:border-accent outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-muted mb-1">
                Target Due Date
              </label>
              <input
                type="date"
                required
                value={projectForm.dueDate}
                onChange={(e) => setProjectForm({ ...projectForm, dueDate: e.target.value })}
                className="w-full px-3 py-2 bg-surface border border-border rounded-xl text-sm text-text focus:border-accent outline-hidden"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-border/60">
            <Button type="button" variant="secondary" onClick={() => setIsProjectModalOpen(false)} className="rounded-xl">
              Cancel
            </Button>
            <Button type="submit" className="rounded-xl bg-blue-600 hover:bg-blue-500 text-white">
              Create Project
            </Button>
          </div>
        </form>
      </Modal>

      {/* NEW MILESTONE MODAL */}
      <Modal 
        isOpen={isMilestoneModalOpen} 
        onClose={() => setIsMilestoneModalOpen(false)} 
        title="Create Strategic Milestone"
      >
        <form onSubmit={handleMilestoneSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-text-muted mb-1">
              Milestone Checkpoint Title
            </label>
            <input
              type="text"
              required
              placeholder="Deliver pure JPA database integration"
              value={milestoneForm.title}
              onChange={(e) => setMilestoneForm({ ...milestoneForm, title: e.target.value })}
              className="w-full px-3 py-2 bg-surface border border-border rounded-xl text-sm text-text focus:border-accent outline-hidden"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-text-muted mb-1">
                Target Project
              </label>
              <select
                value={milestoneForm.projectCode}
                onChange={(e) => setMilestoneForm({ ...milestoneForm, projectCode: e.target.value })}
                className="w-full px-3 py-2 bg-surface border border-border rounded-xl text-sm text-text focus:border-accent outline-hidden"
              >
                {projects.map((p) => (
                  <option key={p.code} value={p.code}>
                    {p.code} - {p.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-muted mb-1">
                Milestone Owner
              </label>
              <input
                type="text"
                required
                value={milestoneForm.owner}
                onChange={(e) => setMilestoneForm({ ...milestoneForm, owner: e.target.value })}
                className="w-full px-3 py-2 bg-surface border border-border rounded-xl text-sm text-text focus:border-accent outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-text-muted mb-1">
                Target Date
              </label>
              <input
                type="date"
                required
                value={milestoneForm.targetDate}
                onChange={(e) => setMilestoneForm({ ...milestoneForm, targetDate: e.target.value })}
                className="w-full px-3 py-2 bg-surface border border-border rounded-xl text-sm text-text focus:border-accent outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-muted mb-1">
                Initial Progress %
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={milestoneForm.progress}
                onChange={(e) => setMilestoneForm({ ...milestoneForm, progress: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-surface border border-border rounded-xl text-sm text-text focus:border-accent outline-hidden"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-border/60">
            <Button type="button" variant="secondary" onClick={() => setIsMilestoneModalOpen(false)} className="rounded-xl">
              Cancel
            </Button>
            <Button type="submit" className="rounded-xl bg-blue-600 hover:bg-blue-500 text-white">
              Save Milestone
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
