import React from 'react';
import type { Subject } from '@/types';
import { SUBJECTS } from '@/constants';

interface SubjectBadgeProps {
  subject: Subject;
  size?: 'sm' | 'md';
  className?: string;
}

export default function SubjectBadge({ subject, size = 'md', className = '' }: SubjectBadgeProps) {
  const config = SUBJECTS.find(s => s.value === subject);
  const bgClass = config?.bgClass ?? 'bg-muted text-muted-foreground';
  const sizeClass = size === 'sm' ? 'text-[10px] px-1.5 py-0.5' : 'text-xs px-2 py-1';

  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full ${bgClass} ${sizeClass} ${className}`}
    >
      {subject}
    </span>
  );
}