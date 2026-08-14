import { LucideIcon } from 'lucide-react';

interface IconProps {
  icon: LucideIcon;
  size?: number | string;
  className?: string;
  strokeWidth?: number;
}

export default function Icon({ icon: IconComponent, size = 24, className = '', strokeWidth = 2 }: IconProps) {
  return <IconComponent size={size} className={className} strokeWidth={strokeWidth} />;
}
