import React from 'react';

export default function Chip({ 
  label, 
  variant = 'default', // 'easy' | 'medium' | 'hard' | 'teal' | 'amber' | 'default'
  size = 'md',        // 'sm' | 'md'
  icon: Icon,
  className = '',
  onClick
}) {
  const variantStyles = {
    easy: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
    medium: 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30',
    hard: 'bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/30',
    amber: 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30',
    teal: 'bg-teal-500/15 text-teal-700 dark:text-teal-400 border-teal-500/30',
    default: 'bg-surface-elevated text-foreground-secondary border-border hover:border-border-focus',
  };

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 rounded-chip font-medium',
    md: 'text-xs px-2.5 py-1 rounded-chip font-medium',
  };

  return (
    <span
      onClick={onClick}
      className={`inline-flex items-center gap-1 border transition-colors ${variantStyles[variant] || variantStyles.default} ${sizeStyles[size]} ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
    >
      {Icon && <Icon className="w-3 h-3 shrink-0" />}
      <span>{label}</span>
    </span>
  );
}
