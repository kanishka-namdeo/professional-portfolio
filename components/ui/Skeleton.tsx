interface SkeletonProps {
  className?: string;
}

export function SkeletonCard({ className = '' }: SkeletonProps) {
  return (
    <div className={`skeleton-card ${className}`}>
      <div className="skeleton-icon skeleton-pulse"></div>
      <div className="skeleton-content">
        <div className="skeleton-title skeleton-pulse"></div>
        <div className="skeleton-text skeleton-pulse"></div>
        <div className="skeleton-text skeleton-pulse" style={{ width: '80%' }}></div>
        <div className="skeleton-tags">
          <div className="skeleton-tag skeleton-pulse"></div>
          <div className="skeleton-tag skeleton-pulse"></div>
          <div className="skeleton-tag skeleton-pulse"></div>
        </div>
      </div>
    </div>
  );
}
