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
        return <AlertTriangle className="w-3.5 h-3.5 text-rose-500" strokeWidth={1.8} />;
      case 'DIRECT_MESSAGE':
        return <MessageSquare className="w-3.5 h-3.5 text-blue-500" strokeWidth={1.8} />;
      case 'APPROVAL_REQUEST':
        return <ShieldCheck className="w-3.5 h-3.5 text-amber-500" strokeWidth={1.8} />;
      default:
        return <Info className="w-3.5 h-3.5 text-text-muted" strokeWidth={1.8} />;
    }
  };

  return (
    <header className="h-16 border-b border-border/70 bg-surface/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-20 transition-all">
      {/* Left: Breadcrumb / Page Title */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-mono font-bold text-accent px-2 py-0.5 rounded-md bg-accent/10">
          EPSM
        </span>
        <span className="text-xs text-text-faint">/</span>
        <h1 className="text-sm font-bold text-text tracking-tight">{title}</h1>
      </div>

      {/* Middle: Global Search Trigger */}
      <div className="hidden md:block max-w-sm w-full mx-4">
        <button
          onClick={onOpenCommand}
          className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl border border-border/80 bg-bg-subtle/80 text-xs text-text-muted hover:border-border-strong hover:text-text transition-all duration-200 shadow-2xs hover:shadow-xs group"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-text-faint group-hover:text-accent transition-colors" strokeWidth={1.8} />
            <span>Search pages, tasks, or jump to...</span>
          </div>
          <kbd className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded-md border border-border bg-surface text-text-faint shadow-2xs">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right: Health Indicator + Refresh + Notifications */}
      <div className="flex items-center gap-2.5 relative">
        {/* Backend Health Status Badge */}
        <div
          className="flex items-center gap-2 text-xs px-2.5 py-1 rounded-full bg-bg-subtle border border-border/60"
          title={isOnline ? 'Spring Boot 3 backend live on :8080' : 'Backend offline - Using mock cache'}
        >
          <span className="relative flex h-2 w-2">
            {isOnline ? (
              <>
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </>
            ) : (
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
            )}
          </span>
          <span className="text-[11px] font-semibold text-text-muted tabular-nums hidden sm:inline">
            {isOnline ? '8080 live' : 'offline'}
          </span>
        </div>

        {/* Refresh Button */}
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          aria-label="Refresh database cache"
          className="p-2 rounded-xl text-text-muted hover:text-text hover:bg-bg-subtle border border-transparent hover:border-border/60 transition-all duration-200 active:scale-95 disabled:opacity-50"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-accent' : ''}`}
            strokeWidth={1.8}
          />
        </button>

        {/* Notifications Trigger */}
        <button
          onClick={() => setShowNotifications(!showNotifications)}
          aria-label="Toggle notifications dropdown"
          className="p-2 rounded-xl text-text-muted hover:text-text hover:bg-bg-subtle border border-transparent hover:border-border/60 transition-all duration-200 relative active:scale-95"
        >
          <Bell className="w-3.5 h-3.5" strokeWidth={1.8} />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-surface" />
          )}
        </button>

        {/* Notifications Dropdown Card */}
        {showNotifications && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowNotifications(false)}
            />
            <div className="absolute right-0 top-12 w-84 bg-surface border border-border/80 rounded-2xl shadow-xl z-50 overflow-hidden animate-slide-up">
              <div className="p-3.5 border-b border-border/60 flex items-center justify-between bg-bg-subtle/50">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold text-text">Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-accent text-accent-fg">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-[11px] font-semibold text-accent hover:underline flex items-center gap-1"
                  >
                    <CheckCheck className="w-3 h-3" /> Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-border/60">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-3 space-y-1 transition hover:bg-bg-subtle/60 text-left ${
                      n.isRead ? 'opacity-70' : 'bg-surface'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5">
                        {getTypeIcon(n.type)}
                        <span className="font-semibold text-text text-xs">{n.title}</span>
                      </div>
                      <span className="text-[10px] text-text-faint">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-text-muted leading-relaxed pl-5">
                      {n.message}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
