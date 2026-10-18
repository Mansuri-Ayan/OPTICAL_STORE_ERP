import React from 'react';
import { cn } from '@/utils/cn';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({ 
  children, 
  variant = 'neutral', 
  size = 'sm',
  className,
  ...props 
}) => {
  const variants = {
    success: 'bg-green-100 text-green-800 ring-green-600/20',
    warning: 'bg-yellow-100 text-yellow-800 ring-yellow-600/20',
    danger: 'bg-red-100 text-red-800 ring-red-600/10',
    info: 'bg-blue-100 text-blue-800 ring-blue-600/20',
    neutral: 'bg-gray-100 text-gray-800 ring-gray-500/10',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium ring-1 ring-inset',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
