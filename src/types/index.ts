export type Board = 'WBBSE' | 'WBCHSE' | 'CBSE' | 'ICSE' | 'ISC';
export type Subject = 'Mathematics' | 'Physics' | 'Chemistry' | 'Biology' | 'English' | 'Computer Science';
export type Difficulty = 'Easy' | 'Medium' | 'Hard';
export type ContentType = 'note' | 'mcq' | 'quiz' | 'pyq' | 'formula';

export interface Note {
  id: string;
  title: string;
  subject: Subject;
  board: Board;
  classLevel: number;
  chapter: string;
  chapterNumber: number;
  readTime: number;
  difficulty: Difficulty;
  tags: string[];
  excerpt: string;
  publishedAt: string;
  isFeatured: boolean;
  viewCount: number;
}

export interface MCQOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface MCQ {
  id: string;
  question: string;
  options: MCQOption[];
  explanation: string;
  subject: Subject;
  board: Board;
  classLevel: number;
  chapter: string;
  difficulty: Difficulty;
  marks: number;
  tags: string[];
  year?: number;
}

export interface Quiz {
  id: string;
  title: string;
  subject: Subject;
  board: Board;
  classLevel: number;
  chapter: string;
  difficulty: Difficulty;
  questionCount: number;
  durationMinutes: number;
  description: string;
  tags: string[];
  attemptCount: number;
  rating: number;
  questions: MCQ[];
}

export interface PYQ {
  id: string;
  question: string;
  subject: Subject;
  board: Board;
  classLevel: number;
  year: number;
  marks: number;
  chapter: string;
  difficulty: Difficulty;
  tags: string[];
  modelAnswer?: string;
  isLong: boolean;
}

export interface Formula {
  id: string;
  title: string;
  expression: string;
  description: string;
  subject: Subject;
  chapter: string;
  variables?: Record<string, string>;
}

export interface SearchResult {
  id: string;
  type: ContentType;
  title: string;
  subject: Subject;
  board: Board;
  classLevel: number;
  chapter: string;
  excerpt?: string;
  difficulty?: Difficulty;
  href: string;
}