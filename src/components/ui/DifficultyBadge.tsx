import React from 'react';
import type { Difficulty } from '@/types';
import { DIFFICULTY_CONFIG } from '@/constants';

interface DifficultyBadgeProps {
  difficulty: Difficulty;
  size?: 'sm' | 'md';
  className?: string;
}

export default function DifficultyBadge({ difficulty, size = 'md', className = '' }: DifficultyBadgeProps) {
  const config = DIFFICULTY_CONFIG[difficulty];
  const sizeClass = size === 'sm' ? 'text-[10px] px-1.5 py-0.5' : 'text-xs px-2 py-1';

  return (
    <span className={`inline-flex items-center font-semibold rounded-full ${config.className} ${sizeClass} ${className}`}>
      {config.label}
    </span>
  );
}