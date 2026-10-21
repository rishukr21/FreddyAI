import React from 'react';
import Card from './Card';

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className = ''
}) {
  return (
    <Card className={`text-center py-12 px-6 flex flex-col items-center justify-center ${className}`}>
      {Icon && (
        <div className="w-14 h-14 rounded-2xl bg-surface-elevated border border-border flex items-center justify-center mb-4 text-amber-500 shadow-sm">
          <Icon className="w-7 h-7 stroke-[1.8]" />
        </div>
      )}
      <h3 className="text-lg font-heading font-bold text-foreground">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-foreground-secondary max-w-md mt-1.5 leading-relaxed">
          {description}
        </p>
      )}
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          type="button"
          className="mt-5 px-5 py-2.5 rounded-chip text-sm font-semibold bg-amber-500 hover:bg-amber-600 text-black shadow-sm transition-all active:scale-95 inline-flex items-center gap-2"
        >
          {actionLabel}
        </button>
      )}
    </Card>
  );
}
