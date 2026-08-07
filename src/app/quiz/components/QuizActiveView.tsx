'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { MCQ } from '@/types';
import { Clock, ChevronLeft, ChevronRight, AlertTriangle, X } from 'lucide-react';
import SubjectBadge from '@/components/ui/SubjectBadge';
import DifficultyBadge from '@/components/ui/DifficultyBadge';

interface QuizSession {
  quiz: { id: string; title: string; subject: any; board: any; classLevel: number; durationMinutes: number; questions: MCQ[]; difficulty: any };
  answers: Record<string, string>;
  startedAt: number;
  timeRemaining: number;
}

interface QuizActiveViewProps {
  session: QuizSession;
  onSubmit: (answers: Record<string, string>) => void;
  onExit: () => void;
}

export default function QuizActiveView({ session, onSubmit, onExit }: QuizActiveViewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(session.timeRemaining);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const questions = session.quiz.questions.length > 0 ? session.quiz.questions : [];
  const currentQ = questions[currentIndex];
  const answeredCount = Object.keys(answers).length;
  const progress = questions.length > 0 ? (answeredCount / questions.length) * 100 : 0;

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleAutoSubmit = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    onSubmit(answers);
  }, [answers, onSubmit]);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [handleAutoSubmit]);

  const handleAnswer = (questionId: string, optionId: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionId }));
  };

  const handleSubmit = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    onSubmit(answers);
  };

  const isTimeLow = timeLeft < 120;

  if (!currentQ) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-muted-foreground">No questions available for this quiz.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      {/* Quiz Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-base font-bold text-foreground">{session.quiz.title}</h1>
          <div className="flex items-center gap-2 mt-1">
            <SubjectBadge subject={session.quiz.subject} size="sm" />
            <DifficultyBadge difficulty={session.quiz.difficulty} size="sm" />
            <span className="text-[11px] text-muted-foreground">Class {session.quiz.classLevel}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-mono text-sm font-semibold ${
            isTimeLow ? 'border-danger bg-danger-light text-danger' : 'border-border bg-card text-foreground'
          }`}>
            <Clock size={14} className={isTimeLow ? 'animate-pulse' : ''} />
            {formatTime(timeLeft)}
          </div>
          <button
            onClick={() => setShowExitConfirm(true)}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
            aria-label="Exit quiz"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
          <span>Question {currentIndex + 1} of {questions.length}</span>
          <span>{answeredCount} answered</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
            role="progressbar"
            aria-valuenow={Math.round(progress)}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
      </div>

      {/* Question Navigator */}
      <div className="flex flex-wrap gap-1.5 mb-6 p-4 bg-card border border-border rounded-xl">
        {questions.map((q, idx) => (
          <button
            key={`q-nav-${q.id}`}
            onClick={() => setCurrentIndex(idx)}
            className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all duration-150 ${
              idx === currentIndex
                ? 'bg-primary text-primary-foreground'
                : answers[q.id]
                  ? 'bg-success text-white' :'bg-muted text-muted-foreground hover:text-foreground'
            }`}
            aria-label={`Go to question ${idx + 1}${answers[q.id] ? ' (answered)' : ''}`}
          >
            {idx + 1}
          </button>
        ))}
      </div>

      {/* Question Card */}
      <div className="bg-card border border-border rounded-xl p-6 mb-5 card-shadow animate-scale-in">
        <div className="flex items-start justify-between gap-3 mb-4">
          <span className="text-xs font-semibold text-muted-foreground bg-muted px-2 py-1 rounded-lg">
            Q{currentIndex + 1} · {currentQ.marks} mark{currentQ.marks > 1 ? 's' : ''}
          </span>
          <DifficultyBadge difficulty={currentQ.difficulty} size="sm" />
        </div>

        <p className="text-base font-medium text-foreground leading-relaxed mb-6">
          {currentQ.question}
        </p>

        <div className="space-y-3">
          {currentQ.options.map((option, optIdx) => {
            const isSelected = answers[currentQ.id] === option.id;
            return (
              <button
                key={`active-opt-${option.id}`}
                onClick={() => handleAnswer(currentQ.id, option.id)}
                className={`w-full text-left flex items-center gap-3 px-4 py-3.5 rounded-xl border transition-all duration-150 text-sm ${
                  isSelected
                    ? 'quiz-option-selected border font-medium' :'bg-muted border-border text-foreground hover:border-primary/40 hover:bg-primary-light/50'
                }`}
                aria-pressed={isSelected}
              >
                <span className={`flex-shrink-0 w-6 h-6 rounded-full border text-xs font-bold flex items-center justify-center ${
                  isSelected ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground'
                }`}>
                  {String.fromCharCode(65 + optIdx)}
                </span>
                {option.text}
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentIndex(p => Math.max(0, p - 1))}
          disabled={currentIndex === 0}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={15} /> Previous
        </button>

        {currentIndex < questions.length - 1 ? (
          <button
            onClick={() => setCurrentIndex(p => Math.min(questions.length - 1, p + 1))}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all active:scale-95"
          >
            Next <ChevronRight size={15} />
          </button>
        ) : (
          <button
            onClick={() => setShowSubmitConfirm(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-success text-white text-sm font-semibold hover:bg-success/90 transition-all active:scale-95"
          >
            Submit Quiz ✓
          </button>
        )}
      </div>

      {/* Exit Confirm Modal */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" role="dialog" aria-modal="true">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-sm w-full card-shadow animate-scale-in">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-warning-light flex items-center justify-center">
                <AlertTriangle size={18} className="text-warning" />
              </div>
              <h2 className="text-base font-semibold text-foreground">Exit Quiz?</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-5">
              Your progress will be lost. You have answered {answeredCount} of {questions.length} questions.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowExitConfirm(false)}
                className="flex-1 py-2.5 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:text-foreground transition-all"
              >
                Continue Quiz
              </button>
              <button
                onClick={onExit}
                className="flex-1 py-2.5 rounded-xl bg-danger text-white text-sm font-semibold hover:bg-danger/90 transition-all"
              >
                Exit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Submit Confirm Modal */}
      {showSubmitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" role="dialog" aria-modal="true">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-sm w-full card-shadow animate-scale-in">
            <h2 className="text-base font-semibold text-foreground mb-2">Submit Quiz?</h2>
            <p className="text-sm text-muted-foreground mb-2">
              You have answered <strong className="text-foreground">{answeredCount}</strong> of <strong className="text-foreground">{questions.length}</strong> questions.
            </p>
            {answeredCount < questions.length && (
              <p className="text-xs text-warning bg-warning-light p-2.5 rounded-lg mb-4">
                {questions.length - answeredCount} questions are unanswered. They will be marked incorrect.
              </p>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => setShowSubmitConfirm(false)}
                className="flex-1 py-2.5 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:text-foreground transition-all"
              >
                Review
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 py-2.5 rounded-xl bg-success text-white text-sm font-semibold hover:bg-success/90 transition-all"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}