import React from 'react';
import Link from 'next/link';
import type { Note } from '@/types';
import SubjectBadge from './SubjectBadge';
import DifficultyBadge from './DifficultyBadge';
import BoardBadge from './BoardBadge';
import { Clock, Eye, BookOpen, ChevronRight } from 'lucide-react';

interface NoteCardProps {
  note: Note;
  variant?: 'default' | 'compact' | 'featured';
}

export default function NoteCard({ note, variant = 'default' }: NoteCardProps) {
  if (variant === 'compact') {
    return (
      <Link
        href={`/notes/${note.id}`}
        className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted transition-all duration-150 group"
      >
        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary-light flex items-center justify-center text-primary">
          <BookOpen size={14} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors truncate">{note.title}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <SubjectBadge subject={note.subject} size="sm" />
            <span className="text-[11px] text-muted-foreground">Class {note.classLevel}</span>
          </div>
        </div>
        <ChevronRight size={14} className="text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-1" />
      </Link>
    );
  }

  if (variant === 'featured') {
    return (
      <Link
        href={`/notes/${note.id}`}
        className="group block bg-card border border-border rounded-xl p-6 card-shadow card-shadow-hover"
      >
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex flex-wrap gap-1.5">
            <BoardBadge board={note.board} size="sm" />
            <SubjectBadge subject={note.subject} size="sm" />
            <DifficultyBadge difficulty={note.difficulty} size="sm" />
          </div>
          <span className="text-xs text-muted-foreground whitespace-nowrap">Ch. {note.chapterNumber}</span>
        </div>
        <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors mb-2 line-clamp-2">
          {note.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{note.excerpt}</p>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1"><Clock size={11} /> {note.readTime} min read</span>
            <span className="flex items-center gap-1"><Eye size={11} /> {note.viewCount.toLocaleString('en-IN')}</span>
          </div>
          <span className="text-primary font-medium group-hover:underline">Read →</span>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/notes/${note.id}`}
      className="group block bg-card border border-border rounded-xl p-5 card-shadow card-shadow-hover"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex flex-wrap gap-1.5">
          <BoardBadge board={note.board} size="sm" />
          <span className="text-[11px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">Class {note.classLevel}</span>
        </div>
        <DifficultyBadge difficulty={note.difficulty} size="sm" />
      </div>
      <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors mb-1.5 line-clamp-2">
        {note.title}
      </h3>
      <p className="text-xs text-muted-foreground mb-3 line-clamp-1">{note.chapter}</p>
      <SubjectBadge subject={note.subject} size="sm" />
      <div className="flex items-center gap-3 mt-3 pt-3 border-t border-border text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1"><Clock size={11} /> {note.readTime} min</span>
        <span className="flex items-center gap-1"><Eye size={11} /> {note.viewCount.toLocaleString('en-IN')}</span>
      </div>
    </Link>
  );
}