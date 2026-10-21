import React from 'react';

export default function Card({ 
  children, 
  className = '', 
  glow = false, 
  interactive = false,
  onClick,
  ...props 
}) {
  return (
    <div
      onClick={onClick}
      className={`bento-card p-6 relative overflow-hidden ${
        glow ? 'border-amber-500/30 shadow-amber-glow' : ''
      } ${
        interactive ? 'cursor-pointer hover:-translate-y-0.5' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
