import React, { useState, useEffect } from 'react';
import { 
  Search, 
  FolderKanban, 
  CheckSquare, 
  Clock, 
  Users, 
  History, 
  Activity 
} from 'lucide-react';

export function CommandPalette({ isOpen, onClose, onNavigate }) {
  const [query, setQuery] = useState('');

  const commands = [
    { id: 'dashboard', label: 'Go to Dashboard', icon: Activity, category: 'Navigation' },
    { id: 'projects', label: 'Go to Projects & Milestones', icon: FolderKanban, category: 'Navigation' },
    { id: 'kanban', label: 'Go to Tasks & Kanban', icon: CheckSquare, category: 'Navigation' },
    { id: 'tickets', label: 'Go to Service Desk & SLA', icon: Clock, category: 'Navigation' },
    { id: 'workload', label: 'Go to Workload & Approvals', icon: Users, category: 'Navigation' },
    { id: 'audit', label: 'Go to Audit & Administration', icon: History, category: 'Navigation' },
  ];

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(false);
      }
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filtered = commands.filter((c) =>
    c.label.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/40 backdrop-blur-2xs"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-surface border border-border-strong rounded-card shadow-floating dark:shadow-floating-dark overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2.5 px-4 border-b border-border">
          <Search className="w-4 h-4 text-text-muted shrink-0" strokeWidth={1.5} />
          <input
            type="text"
            placeholder="Type a command or jump to page..."
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full py-3.5 bg-transparent text-sm text-text placeholder:text-text-faint outline-hidden"
          />
          <kbd className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded border border-border bg-bg-subtle text-text-muted">
            ESC
          </kbd>
        </div>

        <div className="max-h-72 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="py-6 text-center text-xs text-text-faint">
              No matching pages found
            </div>
          ) : (
            filtered.map((cmd) => {
              const Icon = cmd.icon;
              return (
                <button
                  key={cmd.id}
                  onClick={() => {
                    onNavigate(cmd.id);
                    onClose();
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-input text-xs hover:bg-bg-subtle text-left transition"
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 text-accent shrink-0" strokeWidth={1.5} />
                    <span className="font-medium text-text">{cmd.label}</span>
                  </div>
                  <span className="text-[10px] font-mono text-text-faint">Jump &rarr;</span>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
