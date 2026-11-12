import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Drawer } from '../components/ui/Drawer';
import { ProgressBar } from '../components/ui/ProgressBar';
import { 
  Plus, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ShieldAlert, 
  Search, 
  Filter,
  Check,
  Zap
} from 'lucide-react';
import { calculateSla } from '../utils/sla';
import { useCountdown } from '../hooks/useCountdown';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

export function ServiceDeskPage({ 
  tickets = [], 
  onResolveTicket, 
  onCreateTicket 
}) {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [resolutionNotes, setResolutionNotes] = useState('');
  
  useCountdown(10000);

  const [form, setForm] = useState({
    subject: '',
    severity: 'MEDIUM',
    targetHours: 8,
    reporter: user?.name || 'Operations Desk',
    dept: 'Platform Core',
    description: '',
  });

  const handleCreate = (e) => {
    e.preventDefault();
    if (!form.subject.trim()) return;
    const code = `TKT-${Math.floor(100 + Math.random() * 900)}`;
    
    onCreateTicket({
      ...form,
      id: Date.now(),
      code,
      status: 'IN_PROGRESS',
      createdAt: new Date().toISOString(),
    });

    addToast(`Incident ${code} reported and SLA timer started`, 'warning');
    setIsModalOpen(false);
    setForm({
      subject: '',
      severity: 'MEDIUM',
      targetHours: 8,
      reporter: user?.name || 'Operations Desk',
      dept: 'Platform Core',
      description: '',
    });
  };

  const handleConfirmResolve = (ticketId) => {
    onResolveTicket(ticketId);
    addToast(`Ticket marked as RESOLVED with audit notes`, 'success');
    setSelectedTicket(null);
    setResolutionNotes('');
  };

  const getSeverityBadge = (sev) => {
    switch (sev) {
      case 'CRITICAL':
        return <Badge variant="danger" dot pulse>Critical</Badge>;
      case 'HIGH':
        return <Badge variant="warning" dot>High</Badge>;
      case 'MEDIUM':
        return <Badge variant="info">Medium</Badge>;
      case 'LOW':
      default:
        return <Badge variant="neutral">Low</Badge>;
    }
  };

  const filteredTickets = tickets.filter((t) => {
    const matchesSearch =
      t.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.reporter?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity = severityFilter === 'ALL' || t.severity === severityFilter;
    return matchesSearch && matchesSeverity;
  });

  const activeCount = tickets.filter((t) => t.status !== 'RESOLVED').length;
  const criticalCount = tickets.filter((t) => (t.severity === 'CRITICAL' || t.severity === 'HIGH') && t.status !== 'RESOLVED').length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text">Service Desk &amp; SLA</h1>
          <p className="text-xs text-text-muted mt-0.5">
            IT incident tracking &bull; Live real-time SLA countdown engine &bull; 75% warning thresholds &amp; resolution notes
          </p>
        </div>

        <Button 
          onClick={() => setIsModalOpen(true)} 
          size="sm"
          className="rounded-xl shadow-sm bg-blue-600 hover:bg-blue-500 text-white"
        >
          <Plus className="w-3.5 h-3.5 mr-1" strokeWidth={2} />
          <span>Report Incident</span>
        </Button>
      </div>

      {/* SLA Metric Highlights */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4 space-y-2 rounded-2xl border border-border/80 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
          <div className="text-xs text-text-muted font-bold flex items-center justify-between">
            <span>Active Tickets</span>
            <Clock className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-text tabular-nums">{activeCount}</div>
          <p className="text-[11px] text-text-faint font-medium">In Progress</p>
        </Card>

        <Card className="p-4 space-y-2 rounded-2xl border border-border/80 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
          <div className="text-xs text-text-muted font-bold flex items-center justify-between">
            <span>Critical &amp; High</span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-bold text-rose-600 dark:text-rose-400 tabular-nums">{criticalCount}</div>
          <p className="text-[11px] text-text-faint font-medium">Immediate response</p>
        </Card>

        <Card className="p-4 space-y-2 rounded-2xl border border-border/80 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
          <div className="text-xs text-text-muted font-bold flex items-center justify-between">
            <span>SLA Compliance</span>
            <Zap className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400 tabular-nums">98.5%</div>
          <p className="text-[11px] text-text-faint font-medium">Target &gt; 95%</p>
        </Card>

        <Card className="p-4 space-y-2 rounded-2xl border border-border/80 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
          <div className="text-xs text-text-muted font-bold flex items-center justify-between">
            <span>Resolved</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
            {tickets.filter((t) => t.status === 'RESOLVED').length}
          </div>
          <p className="text-[11px] text-text-faint font-medium">Passed SLA targets</p>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-surface/80 backdrop-blur-md border border-border/80 rounded-2xl shadow-xs">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-text-faint absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by code or subject..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-bg-subtle/70 border border-border/60 rounded-xl text-xs text-text focus:border-accent outline-hidden w-64 transition-colors"
            />
          </div>

          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="px-3 py-1.5 bg-bg-subtle/70 border border-border/60 rounded-xl text-xs text-text focus:border-accent outline-hidden transition-colors font-medium"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>

        <span className="text-xs text-text-faint font-medium">
          Showing {filteredTickets.length} of {tickets.length} tickets
        </span>
      </div>

      {/* Tickets Table with Live SLA Countdown */}
      <Card className="p-0 overflow-hidden rounded-2xl border border-border/80 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border/70 bg-bg-subtle/70 text-text-muted text-xs h-11">
                <th className="px-5 font-bold">Ticket Code</th>
                <th className="px-4 font-bold">Incident Subject</th>
                <th className="px-4 font-bold">Severity</th>
                <th className="px-4 font-bold">Reporter / Dept</th>
                <th className="px-4 font-bold">Status</th>
                <th className="px-5 font-bold w-60">Live SLA Countdown</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredTickets.map((t) => {
                const sla = calculateSla(
                  t.createdAt || '2026-11-05T08:00:00', 
                  t.targetHours || 8, 
                  t.status
                );
                const isBreached = sla.isBreached;
                const isWarning = sla.isWarning;

                return (
                  <tr
                    key={t.id || t.code}
                    onClick={() => setSelectedTicket(t)}
                    className="h-16 hover:bg-bg-subtle/50 cursor-pointer transition-colors"
                  >
                    <td className="px-5 font-mono text-xs font-bold text-blue-600 dark:text-blue-400">{t.code}</td>
                    <td className="px-4">
                      <div className="font-bold text-text text-sm truncate max-w-xs">{t.subject}</div>
                      <div className="text-[11px] text-text-faint truncate font-medium">{t.description || 'Enterprise issue logged'}</div>
                    </td>
                    <td className="px-4">{getSeverityBadge(t.severity)}</td>
                    <td className="px-4 text-text-muted">
                      <div className="font-bold text-text">{t.reporter}</div>
                      <div className="text-[11px] text-text-faint">{t.dept}</div>
                    </td>
                    <td className="px-4">
                      {t.status === 'RESOLVED' ? (
                        <span className="inline-flex items-center gap-1.5 text-xs text-emerald-600 font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          Resolved
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs text-blue-600 font-bold">
                          <Clock className="w-3.5 h-3.5" />
                          Active
                        </span>
                      )}
                    </td>
                    <td className="px-5">
                      {t.status === 'RESOLVED' ? (
                        <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> SLA Met &bull; Completed
                        </span>
                      ) : (
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className={isBreached ? 'text-rose-600 font-bold' : isWarning ? 'text-amber-600 font-bold' : 'text-text font-medium'}>
                              {sla.timeRemaining}
                            </span>
                            <span className="font-mono text-text-faint text-[10px] font-bold">{sla.percent}%</span>
                          </div>
                          <ProgressBar
                            value={sla.percent}
                            variant={isBreached ? 'danger' : isWarning ? 'warning' : 'accent'}
                          />
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Ticket Details Drawer */}
      {selectedTicket && (
        <Drawer
          isOpen={Boolean(selectedTicket)}
          onClose={() => setSelectedTicket(null)}
          title={`Ticket Details: ${selectedTicket.code}`}
        >
          <div className="space-y-4">
            <div className="p-3.5 bg-bg-subtle/80 rounded-xl border border-border/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-blue-600">{selectedTicket.code}</span>
                {getSeverityBadge(selectedTicket.severity)}
              </div>
              <h3 className="text-sm font-bold text-text">{selectedTicket.subject}</h3>
              <p className="text-xs text-text-muted leading-relaxed">
                {selectedTicket.description || 'No detailed issue description provided.'}
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-border/50">
                <span className="text-text-muted">Reporter</span>
                <span className="font-bold text-text">{selectedTicket.reporter}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-border/50">
                <span className="text-text-muted">Department</span>
                <span className="font-bold text-text">{selectedTicket.dept}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-border/50">
                <span className="text-text-muted">Target SLA</span>
                <span className="font-bold text-text">{selectedTicket.targetHours || 8} hours</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-border/50">
                <span className="text-text-muted">Status</span>
                <span className="font-bold text-text">{selectedTicket.status}</span>
              </div>
            </div>

            {selectedTicket.status !== 'RESOLVED' && (
              <div className="pt-2 space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-text-muted mb-1">
                    Resolution Notes &amp; Root Cause
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Enter root cause analysis and resolution steps taken..."
                    value={resolutionNotes}
                    onChange={(e) => setResolutionNotes(e.target.value)}
                    className="w-full px-3 py-2 bg-surface border border-border rounded-xl text-xs text-text focus:border-accent outline-hidden"
                  />
                </div>

                <Button
                  className="w-full rounded-xl bg-blue-600 hover:bg-blue-500 text-white"
                  onClick={() => handleConfirmResolve(selectedTicket.id)}
                >
                  <Check className="w-4 h-4 mr-1" />
                  Mark as Resolved &amp; Close Ticket
                </Button>
              </div>
            )}
          </div>
        </Drawer>
      )}

      {/* Report Incident Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Report Service Desk Incident"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-text-muted mb-1">
              Incident Subject
            </label>
            <input
              type="text"
              required
              placeholder="Database Connection Timeout on Worker 3"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              className="w-full px-3 py-2 bg-surface border border-border rounded-xl text-sm text-text focus:border-accent outline-hidden"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-text-muted mb-1">
                Severity Level
              </label>
              <select
                value={form.severity}
                onChange={(e) => {
                  const sev = e.target.value;
                  const hours = sev === 'CRITICAL' ? 4 : sev === 'HIGH' ? 8 : sev === 'MEDIUM' ? 16 : 24;
                  setForm({ ...form, severity: sev, targetHours: hours });
                }}
                className="w-full px-3 py-2 bg-surface border border-border rounded-xl text-sm text-text focus:border-accent outline-hidden"
              >
                <option value="CRITICAL">Critical (4h SLA)</option>
                <option value="HIGH">High (8h SLA)</option>
                <option value="MEDIUM">Medium (16h SLA)</option>
                <option value="LOW">Low (24h SLA)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-muted mb-1">
                Target SLA (Hours)
              </label>
              <input
                type="number"
                min="1"
                max="72"
                value={form.targetHours}
                onChange={(e) => setForm({ ...form, targetHours: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-surface border border-border rounded-xl text-sm text-text focus:border-accent outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-muted mb-1">
              Description &amp; Error Details
            </label>
            <textarea
              rows={3}
              placeholder="Steps to reproduce, stack traces, impacted business services..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-3 py-2 bg-surface border border-border rounded-xl text-sm text-text focus:border-accent outline-hidden"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-border/60">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)} className="rounded-xl">
              Cancel
            </Button>
            <Button type="submit" className="rounded-xl bg-blue-600 hover:bg-blue-500 text-white">
              Submit Incident Ticket
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
