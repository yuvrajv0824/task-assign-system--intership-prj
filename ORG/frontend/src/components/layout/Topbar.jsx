import React, { useState } from 'react';
import { Search, Bell, RefreshCw, CheckCheck, MessageSquare, AlertTriangle, ShieldCheck, Info } from 'lucide-react';

export function Topbar({
  title,
  onOpenCommand,
  isOnline,
  onRefresh,
  isRefreshing,
}) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      code: 'NTF-101',
      sender: 'Service Desk SLA',
      type: 'SLA_ALERT',
      title: 'Critical SLA Warning on TKT-101',
      message: 'Memory Leak on Task Runner has elapsed 82% of target SLA threshold.',
      priority: 'CRITICAL',
      isRead: false,
      time: '12m ago'
    },
    {
      id: 2,
      code: 'NTF-102',
      sender: 'Karthik Swaminathan',
      type: 'DIRECT_MESSAGE',
      title: 'Sprint 25 Architecture Review',
      message: 'Review completed. Please verify pure JPA repository queries for sprint metrics.',
      priority: 'MEDIUM',
      isRead: false,
      time: '1h ago'
    },
    {
      id: 3,
      code: 'NTF-103',
      sender: 'DevOps Desk',
      type: 'APPROVAL_REQUEST',
      title: 'Deployment Approval: PRJ-102',
      message: 'Karthik Swaminathan submitted production database schema migration for review.',
      priority: 'HIGH',
      isRead: false,
      time: '3h ago'
    }
  ]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'SLA_ALERT':
        return <AlertTriangle className="w-3.5 h-3.5 text-status-danger" strokeWidth={1.5} />;
      case 'DIRECT_MESSAGE':
        return <MessageSquare className="w-3.5 h-3.5 text-status-info" strokeWidth={1.5} />;
      case 'APPROVAL_REQUEST':
        return <ShieldCheck className="w-3.5 h-3.5 text-status-warning" strokeWidth={1.5} />;
      default:
        return <Info className="w-3.5 h-3.5 text-text-muted" strokeWidth={1.5} />;
    }
  };

  return (
    <header className="h-14 border-b border-border bg-surface px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Left: Breadcrumb / Page Title */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-mono font-medium text-text-muted">
          EPSM
        </span>
        <span className="text-xs text-text-faint">/</span>
        <h1 className="text-sm font-semibold text-text tracking-tight">{title}</h1>
      </div>

      {/* Middle: Global Search Trigger */}
      <div className="hidden md:block max-w-sm w-full mx-4">
        <button
          onClick={onOpenCommand}
          className="w-full flex items-center justify-between px-3 py-1.5 rounded-input border border-border bg-bg-subtle text-xs text-text-muted hover:border-border-strong hover:text-text transition text-left"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-text-faint" strokeWidth={1.5} />
            <span>Search or jump to...</span>
          </div>
          <kbd className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded border border-border bg-surface text-text-faint">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right: Health dot + Refresh + Notifications */}
      <div className="flex items-center gap-3 relative">
        {/* Backend Health Dot */}
        <div
          className="flex items-center gap-2 text-xs text-text-muted"
          title={isOnline ? 'Spring Boot 3 backend connected on :8080' : 'Backend offline - Using sample data'}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              isOnline ? 'bg-status-success' : 'bg-status-warning'
            }`}
          />
          <span className="hidden sm:inline text-xs text-text-faint">
            {isOnline ? ':8080 live' : 'offline demo'}
          </span>
        </div>

        {/* Refresh API */}
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="p-1.5 rounded-input text-text-muted hover:text-text hover:bg-bg-subtle"
          title="Refresh data"
          aria-label="Refresh data"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} strokeWidth={1.5} />
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-1.5 rounded-input text-text-muted hover:text-text hover:bg-bg-subtle relative"
            title="Desk Alerts & Messages"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" strokeWidth={1.5} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-status-danger" />
            )}
          </button>

          {/* Notification Popover */}
          {showNotifications && (
            <div className="absolute right-0 top-10 w-80 bg-surface border border-border-strong rounded-card shadow-floating dark:shadow-floating-dark z-30 p-3 space-y-2.5 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <span className="text-xs font-semibold text-text">Desk Alerts &amp; DMs</span>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-[11px] text-text-muted hover:text-text flex items-center gap-1 font-medium"
                  >
                    <CheckCheck className="w-3.5 h-3.5" strokeWidth={1.5} />
                    Mark all read
                  </button>
                )}
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-2.5 rounded-input border transition ${
                      n.isRead ? 'border-border bg-surface' : 'border-border-strong bg-bg-subtle'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] text-text-faint mb-1">
                      <div className="flex items-center gap-1.5">
                        {getTypeIcon(n.type)}
                        <span className="font-semibold text-text">{n.sender}</span>
                      </div>
                      <span className="tabular-nums">{n.time}</span>
                    </div>
                    <div className="text-xs font-semibold text-text leading-snug">{n.title}</div>
                    <p className="text-[11px] text-text-muted mt-0.5 leading-relaxed">{n.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
