import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { ProgressBar } from '../components/ui/ProgressBar';
import { 
  Users, 
  FileCheck2, 
  Check, 
  X, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { calculateWorkload } from '../utils/workload';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export function WorkloadPage({ 
  workload = [], 
  approvals = [], 
  onApprove, 
  onReject 
}) {
  const { user } = useAuth();
  const { addToast } = useToast();
  
  const [activeTab, setActiveTab] = useState('all');
  const [rejectingItem, setRejectingItem] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  const handleConfirmReject = () => {
    if (!rejectingItem) return;
    onReject(rejectingItem.id, rejectReason || 'Insufficient justification / requires PM review');
    addToast(`Rejected request ${rejectingItem.code}`, 'warning');
    setRejectingItem(null);
    setRejectReason('');
  };

  const pendingApprovals = approvals.filter((a) => a.status === 'PENDING');

  // Squad capacity metrics (40h weekly limit per developer)
  const totalAllocatedHours = workload.reduce((acc, dev) => {
    const pts = dev.activePoints ?? dev.points ?? 0;
    return acc + (pts * 4);
  }, 0);
  const totalCapacityHours = (workload.length || 4) * 40;
  const overallUtilization = totalCapacityHours > 0
    ? Math.round((totalAllocatedHours / totalCapacityHours) * 100)
    : 0;
  const overloadedDevs = workload.filter((dev) => {
    const pts = dev.activePoints ?? dev.points ?? 0;
    return (pts * 4) > 40;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text">Workload &amp; Approvals</h1>
          <p className="text-xs text-text-muted mt-0.5">
            Team capacity management &bull; 40h weekly squad thresholds &bull; Enterprise governance &amp; sign-off queue
          </p>
        </div>

        {/* macOS Style Segmented Switcher */}
        <div className="flex items-center gap-1 p-1 bg-surface/80 backdrop-blur-md rounded-xl border border-border/70 shadow-xs">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-150 ${
              activeTab === 'all'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-text-muted hover:text-text'
            }`}
          >
            All Views
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('workload')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-150 flex items-center gap-1.5 ${
              activeTab === 'workload'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-text-muted hover:text-text'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Capacity ({workload.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('approvals')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-150 flex items-center gap-1.5 ${
              activeTab === 'approvals'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-text-muted hover:text-text'
            }`}
          >
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>Approvals ({pendingApprovals.length})</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: SQUAD WORKLOAD & CAPACITY */}
      {(activeTab === 'all' || activeTab === 'workload') && (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-1 border-b border-border/60">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" strokeWidth={1.8} />
              <h2 className="text-base font-bold text-text tracking-tight">Team Capacity &amp; Allocation</h2>
            </div>
            <span className="text-xs text-text-faint font-medium">Standard threshold: 40 hours / sprint</span>
          </div>

          {/* Capacity Summary KPI Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="p-4 space-y-1.5 rounded-2xl border border-border/80">
              <div className="flex items-center justify-between text-xs text-text-muted font-medium">
                <span>Total Squad Load</span>
                <span className="tabular-nums font-bold text-text">{overallUtilization}%</span>
              </div>
              <div className="text-xl font-bold text-text tabular-nums">
                {totalAllocatedHours}h <span className="text-xs text-text-faint font-normal">/ {totalCapacityHours}h</span>
              </div>
              <ProgressBar value={overallUtilization} variant={overallUtilization > 100 ? 'danger' : 'info'} />
            </Card>

            <Card className="p-4 space-y-1.5 rounded-2xl border border-border/80">
              <div className="flex items-center justify-between text-xs text-text-muted font-medium">
                <span>Monitored Squad</span>
                <Badge variant="neutral">{workload.length} Engineers</Badge>
              </div>
              <div className="text-xl font-bold text-text">
                {workload.length - overloadedDevs.length} <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">Optimal</span>
              </div>
              <div className="text-[11px] text-text-faint">
                Standard 40h weekly capacity
              </div>
            </Card>

            <Card className="p-4 space-y-1.5 rounded-2xl border border-border/80">
              <div className="flex items-center justify-between text-xs text-text-muted font-medium">
                <span>Burnout Risk</span>
                <Badge variant={overloadedDevs.length > 0 ? 'danger' : 'success'} dot>
                  {overloadedDevs.length > 0 ? `${overloadedDevs.length} Overload` : 'All Balanced'}
                </Badge>
              </div>
              <div className="text-xl font-bold text-text tabular-nums">
                {overloadedDevs.length > 0 ? `${overloadedDevs.length} Exceeded` : '0 Breaches'}
              </div>
              <div className="text-[11px] text-text-faint">
                {overloadedDevs.length > 0 ? 'Rebalance sprint assignments' : 'Capacity within safety threshold'}
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {workload.map((dev) => {
              const points = dev.activePoints ?? dev.points ?? 0;
              const calc = calculateWorkload(points, 40);
              const isOverload = calc.isOverload;
              const isBurnoutRisk = calc.isBurnoutRisk;
              const squadName = dev.team || dev.squad || 'Platform Core';

              return (
                <Card key={dev.name} className="space-y-3.5 p-5 rounded-2xl border border-border/80 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-bold text-text truncate">{dev.name}</h3>
                      <p className="text-[11px] text-text-muted truncate font-medium">{squadName}</p>
                      {dev.mentor && (
                        <p className="text-[10px] text-text-faint truncate mt-0.5">Mentor: {dev.mentor}</p>
                      )}
                    </div>
                    <Badge variant={isOverload ? 'danger' : calc.status === 'HIGH' ? 'warning' : 'success'} dot>
                      {calc.status}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between text-xs text-text-muted pt-2 border-t border-border/50">
                    <span>
                      Allocated: <strong className="text-text tabular-nums">{calc.hours}h</strong> ({calc.points} pts)
                    </span>
                    <span className="tabular-nums font-bold text-text">{calc.percent}%</span>
                  </div>

                  <div className="space-y-1">
                    <div className="w-full bg-border/60 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          isOverload ? 'bg-rose-500' : calc.status === 'HIGH' ? 'bg-amber-500' : 'bg-blue-600'
                        }`}
                        style={{ width: `${Math.min(100, calc.percent)}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-text-faint tabular-nums font-medium">
                      <span>0h</span>
                      <span>20h</span>
                      <span className="font-semibold text-text">40h limit</span>
                    </div>
                  </div>

                  {isOverload && (
                    <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-[11px] flex items-center justify-between font-medium">
                      <span className="flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                        <span>{isBurnoutRisk ? 'Burnout risk: ' : ''}Exceeded by {calc.hours - 40}h</span>
                      </span>
                      <span className="font-bold underline cursor-pointer" onClick={() => addToast(`Rebalancing triggered for ${dev.name}`, 'info')}>Rebalance</span>
                    </div>
                  )}

                  {dev.tasks && dev.tasks.length > 0 && (
                    <div className="pt-2 border-t border-border/40 space-y-1.5">
                      <span className="text-[10px] font-semibold text-text-faint uppercase tracking-wider block">Assigned Tasks ({dev.tasks.length})</span>
                      <div className="space-y-1">
                        {dev.tasks.slice(0, 2).map((t) => (
                          <div key={t.code} className="flex items-center justify-between text-[11px] text-text-muted bg-bg-subtle/60 px-2 py-1 rounded-lg">
                            <span className="font-mono text-[10px] text-blue-600 dark:text-blue-400 font-semibold">{t.code}</span>
                            <span className="truncate max-w-[140px]">{t.title}</span>
                            <span className="text-text-faint text-[10px] tabular-nums">{t.points}p</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* SECTION 2: GOVERNANCE & APPROVALS WORKFLOW */}
      {(activeTab === 'all' || activeTab === 'approvals') && (
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between pb-1 border-b border-border/60">
            <div className="flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-blue-600" strokeWidth={1.8} />
              <h2 className="text-base font-bold text-text tracking-tight">Governance &amp; Approvals Queue</h2>
            </div>
            <span className="text-xs text-text-muted font-medium">
              {pendingApprovals.length} pending review &bull; PM / Admin authorization
            </span>
          </div>

          <Card className="p-0 overflow-hidden rounded-2xl border border-border/80 shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border/70 bg-bg-subtle/70 text-text-muted text-xs h-11">
                    <th className="px-5 font-bold">Request Code</th>
                    <th className="px-4 font-bold">Action &amp; Justification</th>
                    <th className="px-4 font-bold">Category</th>
                    <th className="px-4 font-bold">Requester</th>
                    <th className="px-4 font-bold">Status</th>
                    <th className="px-5 font-bold text-right">Decisions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {approvals.map((a) => {
                    const isPending = a.status === 'PENDING';
                    const isApproved = a.status === 'APPROVED';

                    return (
                      <tr key={a.id || a.code} className="h-16 hover:bg-bg-subtle/50 transition-colors">
                        <td className="px-5 font-mono text-xs font-bold text-blue-600 dark:text-blue-400">
                          {a.code}
                        </td>
                        <td className="px-4 max-w-sm">
                          <div className="font-bold text-text text-sm truncate">{a.title}</div>
                          {a.notes && (
                            <div className="text-[11px] text-text-faint truncate mt-0.5">{a.notes}</div>
                          )}
                        </td>
                        <td className="px-4">
                          <Badge variant="neutral">{a.category || 'GOVERNANCE'}</Badge>
                        </td>
                        <td className="px-4">
                          <span className="font-bold text-text">{a.requester}</span>
                          <span className="text-[11px] text-text-faint block">{a.projectCode}</span>
                        </td>
                        <td className="px-4">
                          <Badge
                            variant={isApproved ? 'success' : a.status === 'REJECTED' ? 'danger' : 'warning'}
                            dot
                          >
                            {a.status}
                          </Badge>
                        </td>
                        <td className="px-5 text-right">
                          {isPending ? (
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                size="xs"
                                variant="secondary"
                                onClick={() => setRejectingItem(a)}
                                className="text-rose-600 hover:bg-rose-500/10 rounded-lg shadow-2xs"
                              >
                                <X className="w-3 h-3 mr-1" />
                                Reject
                              </Button>
                              <Button
                                size="xs"
                                variant="primary"
                                onClick={() => {
                                  onApprove(a.id);
                                  addToast(`Approved request ${a.code}`, 'success');
                                }}
                                className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg shadow-2xs"
                              >
                                <Check className="w-3 h-3 mr-1" />
                                Approve
                              </Button>
                            </div>
                          ) : (
                            <span className="text-xs text-text-faint italic font-medium">Decision finalized</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* Rejection Modal */}
      <Modal
        isOpen={Boolean(rejectingItem)}
        onClose={() => setRejectingItem(null)}
        title={`Reject Request: ${rejectingItem?.code}`}
      >
        <div className="space-y-4">
          <p className="text-xs text-text-muted leading-relaxed">
            Please provide a governance or technical reason for rejecting request <strong>{rejectingItem?.title}</strong>.
          </p>

          <div>
            <label className="block text-xs font-semibold text-text-muted mb-1">
              Feedback Notes
            </label>
            <textarea
              rows={3}
              required
              placeholder="e.g. Needs updated schema rollback plan or security clearance before deployment."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full px-3 py-2 bg-surface border border-border rounded-xl text-xs text-text focus:border-accent outline-hidden"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-border/60">
            <Button variant="secondary" size="sm" onClick={() => setRejectingItem(null)} className="rounded-xl">
              Cancel
            </Button>
            <Button variant="danger" size="sm" onClick={handleConfirmReject} className="rounded-xl">
              Confirm Rejection
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
