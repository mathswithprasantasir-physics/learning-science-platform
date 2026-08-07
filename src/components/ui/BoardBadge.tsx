import React from 'react';
import type { Board } from '@/types';
import { BOARD_COLORS } from '@/constants';

interface BoardBadgeProps {
  board: Board;
  size?: 'sm' | 'md';
  className?: string;
}

export default function BoardBadge({ board, size = 'md', className = '' }: BoardBadgeProps) {
  const color = BOARD_COLORS[board] ?? '#4F46E5';
  const sizeClass = size === 'sm' ? 'text-[10px] px-1.5 py-0.5' : 'text-xs px-2 py-1';

  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full ${sizeClass} ${className}`}
      style={{ backgroundColor: `${color}18`, color }}
    >
      {board}
    </span>
  );
}