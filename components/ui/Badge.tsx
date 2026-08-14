import React from 'react';

type BadgeSize = 'sm' | 'md';

interface BadgeProps {
  size?: BadgeSize;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const sizeStyles: Record<BadgeSize, React.CSSProperties> = {
  sm: {
    fontSize: '0.75rem',
    padding: '4px 10px',
  },
  md: {
    fontSize: '0.8rem',
    padding: '6px 12px',
  },
};

export default function Badge({
  size = 'sm',
  children,
  className = '',
  style,
}: BadgeProps) {
  const baseStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 'var(--space-xs)',
    fontWeight: 600,
    background: 'var(--color-bg)',
    border: '2px solid var(--color-border)',
    borderRadius: 'var(--radius-full)',
    color: 'var(--color-text-muted)',
    transition: 'all 0.2s ease',
    ...sizeStyles[size],
    ...style,
  };

  return (
    <span className={`neo-badge ${className}`} style={baseStyle}>
      {children}
    </span>
  );
}
