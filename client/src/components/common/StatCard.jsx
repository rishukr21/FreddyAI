import React from 'react';
import Card from './Card';

export default function StatCard({ 
  label, 
  value, 
  unit = '', 
  icon: Icon, 
  iconColor = 'text-amber-400',
  iconBg = 'bg-amber-500/10 border-amber-500/20',
  description = '',
  className = '',
  onClick
}) {
  return (
    <Card 
      onClick={onClick} 
      interactive={!!onClick}
      className={`flex flex-col justify-between ${className}`}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <span className="text-xs uppercase font-bold tracking-wider text-foreground-muted">
          {label}
        </span>
        {Icon && (
          <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${iconBg} ${iconColor}`}>
            <Icon className="w-5 h-5 stroke-[2.2]" />
          </div>
        )}
      </div>

      <div className="mt-1">
        <div className="flex items-baseline gap-1.5">
          <span className="text-3xl lg:text-4xl font-extrabold font-heading text-foreground tracking-tight">
            {value}
          </span>
          {unit && (
            <span className="text-sm font-sans text-foreground-muted font-normal">
              {unit}
            </span>
          )}
        </div>
        {description && (
          <p className="text-xs text-foreground-secondary mt-1.5 line-clamp-1 font-medium">
            {description}
          </p>
        )}
      </div>
    </Card>
  );
}
