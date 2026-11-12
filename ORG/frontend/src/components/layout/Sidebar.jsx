import React from 'react';
import { 
  Activity, 
  FolderKanban, 
  CheckSquare, 
  Clock, 
  Users, 
  History, 
  Sun, 
  Moon, 
  ChevronLeft, 
  ChevronRight,
  ChevronDown,
  Sparkles,
  Command
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export function Sidebar({
  activeTab,
  onSelectTab,
  isCollapsed,
  onToggleCollapse,
  counts = {},
}) {
  const { user, switchPersona, personas } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'projects', label: 'Projects & Milestones', icon: FolderKanban, badge: counts.projects },
    { id: 'kanban', label: 'Tasks', icon: CheckSquare, badge: counts.tasks },
    { id: 'tickets', label: 'Service Desk', icon: Clock, badge: counts.tickets },
    { id: 'workload', label: 'Workload & Approvals', icon: Users, badge: counts.approvals },
    { id: 'audit', label: 'Audit & Admin', icon: History },
  ];

  return (
    <aside
      className={`${
        isCollapsed ? 'w-20' : 'w-64'
      } shrink-0 bg-surface/85 backdrop-blur-xl border-r border-border/70 h-screen sticky top-0 flex flex-col justify-between transition-all duration-300 ease-in-out z-30 select-none shadow-[2px_0_12px_rgba(0,0,0,0.02)]`}
    >
      {/* Top Section */}
      <div className="flex flex-col min-h-0">
        
        {/* macOS Window Controls (Traffic Lights) & Brand Header */}
        <div className="h-16 flex items-center px-4 border-b border-border/50 justify-between">
          <div className="flex items-center gap-3">
            {/* macOS Traffic Lights */}
            <div className="flex items-center gap-2 group/traffic">
              <span className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E] shadow-2xs group-hover/traffic:opacity-85 transition-opacity" />
              <span className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123] shadow-2xs group-hover/traffic:opacity-85 transition-opacity" />
              <span className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29] shadow-2xs group-hover/traffic:opacity-85 transition-opacity" />
            </div>

            {!isCollapsed && (
              <div className="flex items-center gap-2 pl-2 border-l border-border/60">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                  E
                </div>
                <span className="text-xs font-bold tracking-tight text-text">
                  EPSM
                </span>
                <span className="text-[10px] font-mono text-text-faint px-1.5 py-0.2 rounded bg-bg-subtle border border-border/50">
                  v2.5
                </span>
              </div>
            )}
          </div>
        </div>

        {/* macOS Style User Card */}
        {!isCollapsed ? (
          <div className="p-3 border-b border-border/50">
            <div className="relative group">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-bg-subtle/70 hover:bg-bg-subtle border border-border/50 hover:border-border transition-all duration-200 shadow-2xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 via-indigo-600 to-violet-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs ring-2 ring-surface">
                      {user?.initials || 'YV'}
                    </div>
                    {/* macOS Live Status Dot */}
                    <span className="absolute bottom-0 right-0 flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 border-2 border-surface" />
                    </span>
                  </div>
                  <div className="min-w-0 text-left">
                    <div className="text-xs font-bold text-text truncate">{user?.name}</div>
                    <div className="text-[10px] text-text-muted truncate font-medium">{user?.role?.replace('ROLE_', '')}</div>
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-text-muted shrink-0 group-hover:text-text transition-colors" strokeWidth={1.8} />
              </div>

              {/* Native Persona Switcher Overlay */}
              <select
                value={user?.name || ''}
                onChange={(e) => switchPersona(e.target.value)}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                title="Switch persona"
                aria-label="Switch persona"
              >
                {personas.map((p) => (
                  <option key={p.name} value={p.name} className="text-slate-900 bg-white">
                    {p.name} ({p.role})
                  </option>
                ))}
              </select>
            </div>
          </div>
        ) : (
          <div className="p-3 border-b border-border/50 flex justify-center">
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-xs ring-2 ring-surface" title={`${user?.name} (${user?.role})`}>
                {user?.initials || 'YV'}
              </div>
              <span className="absolute bottom-0 right-0 flex h-2 w-2">
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 border border-surface" />
              </span>
            </div>
          </div>
        )}

        {/* Navigation Section Header */}
        {!isCollapsed && (
          <div className="px-4 pt-4 pb-1">
            <span className="text-[10px] font-bold text-text-faint tracking-wider uppercase">
              Main Menu
            </span>
          </div>
        )}

        {/* macOS Style Nav Items (Clean, Soft Rounded Pills) */}
        <nav className="p-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                title={isCollapsed ? item.label : undefined}
                className={`group w-full flex items-center ${
                  isCollapsed ? 'justify-center px-0 py-2.5' : 'justify-between px-3 py-2'
                } rounded-xl text-xs transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-600 text-white font-semibold shadow-xs shadow-blue-500/25'
                    : 'text-text-muted hover:text-text hover:bg-bg-subtle/80 font-medium'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon 
                    className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
                      isActive ? 'text-white' : 'group-hover:scale-105 text-text-muted group-hover:text-text'
                    }`} 
                    strokeWidth={isActive ? 2 : 1.8} 
                  />
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                </div>

                {!isCollapsed && typeof item.badge === 'number' && item.badge > 0 && (
                  <span
                    className={`text-[10px] tabular-nums font-mono px-2 py-0.5 rounded-full transition-colors ${
                      isActive
                        ? 'bg-white/20 text-white font-bold'
                        : 'bg-bg-subtle text-text-muted border border-border/70 font-semibold'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom macOS Controls (Dock-style Theme Toggle & Sidebar Collapse) */}
      <div className="p-3 border-t border-border/50 flex items-center justify-between gap-1.5 bg-bg-subtle/40">
        <button
          onClick={toggleTheme}
          aria-label="Toggle color theme"
          className="p-2 rounded-xl text-text-muted hover:text-text hover:bg-surface border border-transparent hover:border-border/60 transition-all duration-200 flex items-center gap-2 text-xs w-full justify-center active:scale-95 shadow-2xs"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" strokeWidth={1.8} />
          ) : (
            <Moon className="w-4 h-4 text-indigo-500" strokeWidth={1.8} />
          )}
          {!isCollapsed && (
            <span className="font-medium text-[11px] truncate">
              {theme === 'dark' ? 'Light Appearance' : 'Dark Appearance'}
            </span>
          )}
        </button>

        <button
          onClick={onToggleCollapse}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="p-2 rounded-xl text-text-muted hover:text-text hover:bg-surface border border-transparent hover:border-border/60 transition-all duration-200 shrink-0 active:scale-95 shadow-2xs"
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" strokeWidth={1.8} />
          ) : (
            <ChevronLeft className="w-4 h-4" strokeWidth={1.8} />
          )}
        </button>
      </div>
    </aside>
  );
}
