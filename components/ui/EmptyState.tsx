import { FolderOpen } from 'lucide-react';

interface EmptyStateProps {
  message?: string;
}

export function EmptyState({ message = 'Nothing to show yet.' }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <FolderOpen size={48} strokeWidth={1.5} className="empty-state-icon" />
      <p className="empty-state-message">{message}</p>
    </div>
  );
}
