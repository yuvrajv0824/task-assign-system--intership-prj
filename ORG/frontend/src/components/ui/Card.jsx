import React from 'react';

export function Card({
  children,
  className = '',
  hoverable = false,
  onClick,
  ...props
}) {
  return (
    <div
      onClick={onClick}
      className={`bg-surface border border-border/80 rounded-2xl p-5 shadow-xs ${
        hoverable ? 'hover:border-border-strong hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 cursor-pointer' : 'transition-colors duration-200'
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
