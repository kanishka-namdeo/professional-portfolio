import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  style?: React.CSSProperties;
}

export default function Card({
  children,
  className = '',
  hoverable = false,
  style,
}: CardProps) {
  const baseStyle: React.CSSProperties = {
    background: 'var(--color-surface)',
    border: 'var(--border-width) solid var(--color-border)',
    borderRadius: 'var(--radius-md)',
    boxShadow: 'var(--shadow-base)',
    transition: 'all 0.2s ease',
    ...style,
  };

  return (
    <div
      className={`neo-card ${hoverable ? 'neo-card-hoverable' : ''} ${className}`}
      style={baseStyle}
    >
      {children}
    </div>
  );
}
