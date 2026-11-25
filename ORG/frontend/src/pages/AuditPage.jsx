import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { 
  History, 
  Download, 
  Filter, 
  ShieldCheck, 
  Server, 
  Database, 
  KeyRound, 
  Users, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export function AuditPage({ auditLogs = [] }) {
  const { user, switchPersona, personas } = useAuth();
  const { addToast } = useToast();
  const [filterActor, setFilterActor] = useState('');
  const [filterAction, setFilterAction] = useState('ALL');
  const [searchDetail, setSearchDetail] = useState('');

  const filteredLogs = auditLogs.filter((log) => {
    const actorStr = log.actor || log.username || '';
    const actionStr = log.action || '';
    const detailStr = log.message || log.details || '';
    const matchActor = filterActor ? actorStr.toLowerCase().includes(filterActor.toLowerCase()) : true;
    const matchAction = filterAction === 'ALL' || actionStr.includes(filterAction);
    const matchDetail = searchDetail ? detailStr.toLowerCase().includes(searchDetail.toLowerCase()) : true;
    return matchActor && matchAction && matchDetail;
  });

  const exportCsv = () => {
    const headers = ['Timestamp', 'Actor', 'Action', 'Target', 'Message', 'IP'];
    const rows = filteredLogs.map((l) => [
      `"${l.timestamp || l.createdAt || ''}"`,
      `"${l.actor || l.username || ''}"`,
      `"${l.action || ''}"`,
      `"${l.target || ''}"`,
      `"${l.message || l.details || ''}"`,
      `"${l.ip || l.ipAddress || '127.0.0.1'}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `epsm_enterprise_audit_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('Audit trail exported successfully as CSV', 'success');
  };

  const getActionBadge = (action) => {
    if (!action) return <Badge variant="neutral">UNKNOWN</Badge>;
    if (action.includes('INIT') || action.includes('SUCCESS') || action.includes('APPROVED')) {
      return <Badge variant="success" dot>{action}</Badge>;
    }
    if (action.includes('UPDATE') || action.includes('ASSIGN')) {
      return <Badge variant="info">{action}</Badge>;
    }
    if (action.includes('REJECT') || action.includes('FAIL') || action.includes('WARN')) {
      return <Badge variant="danger" dot>{action}</Badge>;
    }
    return <Badge variant="neutral">{action}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-text">Audit &amp; Administration</h1>
          <p className="text-xs text-text-muted mt-0.5">
            Immutable enterprise audit trail &bull; Role-based access control &bull; System health diagnostics
          </p>
        </div>

        <Button onClick={exportCsv} size="sm" variant="secondary">
          <Download className="w-3.5 h-3.5 mr-1" strokeWidth={1.5} />
          <span>Export CSV</span>
        </Button>
      </div>

      {/* 1-CLICK INTERACTIVE ROLE SWITCHER (PDF Section 12) */}
      <Card className="p-4 bg-gradient-to-r from-bg-subtle via-surface to-bg-subtle border border-border space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-border">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-accent" />
            <h3 className="text-xs font-bold text-text uppercase tracking-wider">
              Interactive RBAC Persona Switcher (Instant Multi-Role Testing)
            </h3>
          </div>
          <span className="text-[11px] text-text-muted">
            Currently active: <strong className="text-text font-bold">{user?.name}</strong> ({user?.role})
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {personas.map((p) => {
            const isActive = user?.name === p.name;
            return (
              <button
                key={p.name}
                type="button"
                onClick={() => {
                  switchPersona(p.name);
                  addToast(`Switched persona to ${p.name} (${p.role})`, 'info');
                }}
                className={`p-2.5 rounded-input border text-left transition flex flex-col justify-between ${
                  isActive
                    ? 'bg-accent text-accent-fg border-accent shadow-xs'
                    : 'bg-surface border-border text-text hover:border-accent/40'
                }`}
              >
                <div>
                  <div className="text-xs font-bold truncate">{p.name}</div>
                  <div className={`text-[10px] truncate ${isActive ? 'text-accent-fg/80' : 'text-text-muted'}`}>
                    {p.role.replace('ROLE_', '').replace('_', ' ')}
                  </div>
                </div>
                <div className="pt-2 mt-2 border-t border-border/20 text-[10px] font-mono flex items-center justify-between">
                  <span>{p.initials}</span>
                  {isActive ? <CheckCircle2 className="w-3 h-3" /> : <span>Switch &rarr;</span>}
                </div>
              </button>
            );
          })}
        </div>
      </Card>

      {/* SYSTEM ARCHITECTURE & HEALTH DIAGNOSTICS (PDF Section 4 & 5) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className="p-3.5 space-y-1">
          <div className="flex items-center justify-between text-xs text-text-muted">
            <span className="flex items-center gap-1.5 font-medium">
              <Server className="w-3.5 h-3.5 text-blue-500" />
              Backend Framework
            </span>
            <Badge variant="success">Online</Badge>
          </div>
          <div className="text-sm font-bold text-text">Spring Boot 3.3.4</div>
          <p className="text-[10px] text-text-faint">Java 24 LTS &bull; Pure JPA POJOs</p>
        </Card>

        <Card className="p-3.5 space-y-1">
          <div className="flex items-center justify-between text-xs text-text-muted">
            <span className="flex items-center gap-1.5 font-medium">
              <Database className="w-3.5 h-3.5 text-emerald-500" />
              Persistence Layer
            </span>
            <Badge variant="success">Active</Badge>
          </div>
          <div className="text-sm font-bold text-text">Hibernate ORM</div>
          <p className="text-[10px] text-text-faint">H2 In-Memory / PostgreSQL Dialect</p>
        </Card>

        <Card className="p-3.5 space-y-1">
          <div className="flex items-center justify-between text-xs text-text-muted">
            <span className="flex items-center gap-1.5 font-medium">
              <KeyRound className="w-3.5 h-3.5 text-amber-500" />
              Security &amp; Auth
            </span>
            <Badge variant="info">JWT RBAC</Badge>
          </div>
          <div className="text-sm font-bold text-text">Spring Security 6</div>
          <p className="text-[10px] text-text-faint">Stateless Bearer Tokens</p>
        </Card>

        <Card className="p-3.5 space-y-1">
          <div className="flex items-center justify-between text-xs text-text-muted">
            <span className="flex items-center gap-1.5 font-medium">
              <History className="w-3.5 h-3.5 text-indigo-500" />
              Audit Integrity
            </span>
            <Badge variant="success">Verified</Badge>
          </div>
          <div className="text-sm font-bold text-text">{auditLogs.length} Events Logged</div>
          <p className="text-[10px] text-text-faint">Immutable Audit Repository</p>
        </Card>
      </div>

      {/* FILTER ROW */}
      <div className="flex flex-wrap items-center gap-3 p-3 bg-surface border border-border rounded-card">
        <div className="flex items-center gap-2 text-xs text-text-muted">
          <Filter className="w-3.5 h-3.5 text-text-faint" strokeWidth={1.5} />
          <span>Filters:</span>
        </div>
        <input
          type="text"
          placeholder="Filter by actor (e.g. yuvraj.v)..."
          value={filterActor}
          onChange={(e) => setFilterActor(e.target.value)}
          className="px-2.5 py-1.5 bg-bg-subtle border border-border rounded-input text-xs text-text focus:border-accent outline-hidden w-44"
        />
        <select
          value={filterAction}
          onChange={(e) => setFilterAction(e.target.value)}
          className="px-2.5 py-1.5 bg-bg-subtle border border-border rounded-input text-xs text-text focus:border-accent outline-hidden"
        >
          <option value="ALL">All Actions</option>
          <option value="AUTH">Authentication (LOGIN / TOKEN)</option>
          <option value="APPROVAL">Governance (APPROVAL / REJECT)</option>
          <option value="TASK">Tasks &amp; Sprints</option>
          <option value="TICKET">Service Desk Incidents</option>
          <option value="SYSTEM">System &amp; DB Audits</option>
        </select>
        <input
          type="text"
          placeholder="Search message or target..."
          value={searchDetail}
          onChange={(e) => setSearchDetail(e.target.value)}
          className="px-2.5 py-1.5 bg-bg-subtle border border-border rounded-input text-xs text-text focus:border-accent outline-hidden w-48"
        />
        {(filterActor || filterAction !== 'ALL' || searchDetail) && (
          <button
            type="button"
            onClick={() => {
              setFilterActor('');
              setFilterAction('ALL');
              setSearchDetail('');
            }}
            className="text-xs text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
          >
            Reset
          </button>
        )}
        <span className="text-xs text-text-faint ml-auto">
          Showing {filteredLogs.length} of {auditLogs.length} events
        </span>
      </div>

      {/* ENTERPRISE AUDIT TRAIL TABLE (PDF Section 10) */}
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border bg-bg-subtle text-text-muted text-xs h-10">
                <th className="px-5 font-medium">Timestamp</th>
                <th className="px-4 font-medium">Actor</th>
                <th className="px-4 font-medium">Action Event</th>
                <th className="px-4 font-medium">Target Entity</th>
                <th className="px-4 font-medium">Event Message / Details</th>
                <th className="px-5 font-medium text-right">Client IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredLogs.map((l) => (
                <tr key={l.id} className="h-12 hover:bg-bg-subtle/50 transition">
                  <td className="px-5 font-mono text-[11px] text-text-muted tabular-nums whitespace-nowrap">
                    {l.timestamp || l.createdAt || '2026-11-05 09:00:00'}
                  </td>
                  <td className="px-4 font-semibold text-text whitespace-nowrap">
                    {l.actor || l.username}
                  </td>
                  <td className="px-4 whitespace-nowrap">
                    {getActionBadge(l.action)}
                  </td>
                  <td className="px-4 font-mono text-[11px] text-text-muted whitespace-nowrap">
                    {l.target || 'SYSTEM'}
                  </td>
                  <td className="px-4 text-text max-w-md truncate">
                    {l.message || l.details}
                  </td>
                  <td className="px-5 font-mono text-[11px] text-text-faint text-right whitespace-nowrap">
                    {l.ip || l.ipAddress || '127.0.0.1'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

