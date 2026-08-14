import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  loading?: boolean;
  children: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, React.CSSProperties> = {
  primary: {
    background: 'var(--accent-navy)',
    color: 'white',
    boxShadow: 'var(--shadow-base)',
  },
  secondary: {
    background: 'var(--color-surface)',
    color: 'var(--color-text)',
    boxShadow: 'var(--shadow-base)',
  },
  ghost: {
    background: 'transparent',
    color: 'var(--color-text)',
    boxShadow: 'none',
  },
};

export default function Button({
  variant = 'primary',
  loading = false,
  disabled,
  children,
  className = '',
  style,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  const baseStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'var(--space-sm)',
    padding: 'var(--space-sm) var(--space-lg)',
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 600,
    fontSize: '1rem',
    textDecoration: 'none',
    border: variant === 'ghost' ? 'none' : 'var(--border-width) solid var(--color-border)',
    borderRadius: 'var(--radius-md)',
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s ease',
    whiteSpace: 'nowrap',
    opacity: isDisabled ? 0.5 : 1,
    ...variantStyles[variant],
    ...style,
  };

  return (
    <button
      className={`neo-button ${className}`}
      disabled={isDisabled}
      style={baseStyle}
      data-variant={variant}
      {...props}
    >
      {loading && <span className="neo-button-spinner" aria-hidden="true" />}
      {children}
    </button>
  );
}
