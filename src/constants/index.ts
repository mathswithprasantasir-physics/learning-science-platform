import type { Board, Subject } from '@/types';

export const BOARDS: { value: Board; label: string; classes: number[] }[] = [
  { value: 'WBBSE', label: 'WBBSE', classes: [6, 7, 8, 9, 10] },
  { value: 'WBCHSE', label: 'WBCHSE', classes: [11, 12] },
  { value: 'CBSE', label: 'CBSE', classes: [6, 7, 8, 9, 10, 11, 12] },
  { value: 'ICSE', label: 'ICSE', classes: [6, 7, 8, 9, 10] },
  { value: 'ISC', label: 'ISC', classes: [11, 12] },
];

export const SUBJECTS: { value: Subject; label: string; color: string; bgClass: string }[] = [
  { value: 'Mathematics', label: 'Mathematics', color: '#5B21B6', bgClass: 'subject-badge-math' },
  { value: 'Physics', label: 'Physics', color: '#1D4ED8', bgClass: 'subject-badge-physics' },
  { value: 'Chemistry', label: 'Chemistry', color: '#065F46', bgClass: 'subject-badge-chemistry' },
  { value: 'Biology', label: 'Biology', color: '#166534', bgClass: 'subject-badge-biology' },
  { value: 'English', label: 'English', color: '#92400E', bgClass: 'subject-badge-english' },
  { value: 'Computer Science', label: 'Computer Science', color: '#0C4A6E', bgClass: 'subject-badge-computer' },
];

export const DIFFICULTY_CONFIG = {
  Easy: { label: 'Easy', className: 'bg-success-light text-success' },
  Medium: { label: 'Medium', className: 'bg-warning-light text-warning' },
  Hard: { label: 'Hard', className: 'bg-danger-light text-danger' },
};

export const SUBJECT_ICONS: Record<Subject, string> = {
  Mathematics: '∑',
  Physics: '⚛',
  Chemistry: '⚗',
  Biology: '🧬',
  English: '📖',
  'Computer Science': '💻',
};

export const BOARD_COLORS: Record<Board, string> = {
  WBBSE: '#4F46E5',
  WBCHSE: '#7C3AED',
  CBSE: '#0891B2',
  ICSE: '#059669',
  ISC: '#D97706',
};