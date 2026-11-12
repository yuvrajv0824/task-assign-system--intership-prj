import React from 'react';

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  onClick,
  type = 'button',
  ...props
}) {
  const base = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-hidden disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none select-none';

  const variants = {
    primary: 'bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 shadow-xs hover:shadow hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]',
    secondary: 'bg-surface hover:bg-surface-hover text-text border border-border hover:border-border-strong shadow-2xs hover:shadow-xs hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]',
    accent: 'bg-blue-600 hover:bg-blue-500 text-white shadow-xs hover:shadow-blue-500/20 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]',
    ghost: 'text-text-muted hover:text-text hover:bg-bg-subtle active:scale-[0.98]',
    danger: 'bg-rose-600 hover:bg-rose-500 text-white shadow-xs hover:shadow-rose-500/20 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]',
  };

  const sizes = {
    xs: 'text-[11px] px-2.5 py-1 h-7 gap-1 rounded-md',
    sm: 'text-xs px-3 py-1.5 h-8 gap-1.5 rounded-lg',
    md: 'text-xs font-semibold px-4 py-2 h-9 gap-2 rounded-lg',
    lg: 'text-sm font-semibold px-5 py-2.5 h-10 gap-2.5 rounded-xl',
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${base} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
