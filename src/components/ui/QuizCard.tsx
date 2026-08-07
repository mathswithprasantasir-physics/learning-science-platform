import React from 'react';

import type { Quiz } from '@/types';
import SubjectBadge from './SubjectBadge';
import DifficultyBadge from './DifficultyBadge';
import BoardBadge from './BoardBadge';
import { Clock, Users, Star, ArrowRight } from 'lucide-react';

interface QuizCardProps {
  quiz: Quiz;
  onStart?: (quizId: string) => void;
}

export default function QuizCard({ quiz, onStart }: QuizCardProps) {
  return (
    <div className="group bg-card border border-border rounded-xl p-5 card-shadow card-shadow-hover flex flex-col">
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex flex-wrap gap-1.5">
          <BoardBadge board={quiz.board} size="sm" />
          <span className="text-[11px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">Class {quiz.classLevel}</span>
        </div>
        <DifficultyBadge difficulty={quiz.difficulty} size="sm" />
      </div>

      <h3 className="text-sm font-semibold text-foreground mb-1.5 line-clamp-2">{quiz.title}</h3>
      <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{quiz.description}</p>
      <SubjectBadge subject={quiz.subject} size="sm" />

      <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-border">
        <div className="text-center">
          <p className="text-xs font-semibold text-foreground">{quiz.questionCount}</p>
          <p className="text-[10px] text-muted-foreground">Questions</p>
        </div>
        <div className="text-center border-x border-border">
          <p className="text-xs font-semibold text-foreground flex items-center justify-center gap-0.5">
            <Clock size={10} /> {quiz.durationMinutes}m
          </p>
          <p className="text-[10px] text-muted-foreground">Duration</p>
        </div>
        <div className="text-center">
          <p className="text-xs font-semibold text-foreground flex items-center justify-center gap-0.5">
            <Star size={10} className="fill-warning text-warning" /> {quiz.rating}
          </p>
          <p className="text-[10px] text-muted-foreground">Rating</p>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4">
        <span className="text-[11px] text-muted-foreground flex items-center gap-1">
          <Users size={11} /> {quiz.attemptCount.toLocaleString('en-IN')} attempts
        </span>
        <button
          onClick={() => onStart?.(quiz.id)}
          className="flex items-center gap-1.5 text-xs font-semibold text-primary-foreground bg-primary hover:bg-primary/90 px-3 py-1.5 rounded-lg transition-all duration-150 active:scale-95"
        >
          Start Quiz <ArrowRight size={12} />
        </button>
      </div>
    </div>
  );
}