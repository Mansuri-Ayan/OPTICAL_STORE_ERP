import React from 'react';
import { cn } from '@/utils/cn';

export interface CardProps {
  title?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({ title, children, className, padding = 'md' }) => {
  const paddingClasses = {
    none: '',
    sm: 'p-3 sm:p-4',
    md: 'p-4 sm:p-6',
    lg: 'p-6 sm:p-8',
  };

  return (
    <div className={cn('bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl overflow-hidden', className)}>
      {title && (
        <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
          {typeof title === 'string' ? (
            <h3 className="text-base font-semibold leading-6 text-gray-900">{title}</h3>
          ) : (
            title
          )}
        </div>
      )}
      <div className={paddingClasses[padding]}>{children}</div>
    </div>
  );
};
