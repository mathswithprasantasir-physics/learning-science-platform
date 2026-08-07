'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { MOCK_QUIZZES } from '@/data/mockData';
import type { Quiz } from '@/types';
import QuizCard from '@/components/ui/QuizCard';
import QuizActiveView from './QuizActiveView';
import QuizResultView from './QuizResultView';
import { SUBJECTS } from '@/constants';
import type { Subject, Difficulty } from '@/types';
import EmptyState from '@/components/ui/EmptyState';
import { QuizCardSkeleton } from '@/components/ui/LoadingSkeleton';
import { ClipboardList, Search } from 'lucide-react';
import AppLayout from '@/components/AppLayout';


type QuizState = 'listing' | 'active' | 'result';

interface QuizSession {
  quiz: Quiz;
  answers: Record<string, string>;
  startedAt: number;
  finishedAt?: number;
  timeRemaining: number;
}

export default function QuizPageClient() {
  const [quizState, setQuizState] = useState<QuizState>('listing');
  const [session, setSession] = useState<QuizSession | null>(null);
  const [filterSubject, setFilterSubject] = useState<Subject | ''>('');
  const [filterDifficulty, setFilterDifficulty] = useState<Difficulty | ''>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading] = useState(false);

  const startQuiz = useCallback((quizId: string) => {
    const quiz = MOCK_QUIZZES.find(q => q.id === quizId);
    if (!quiz) return;
    setSession({
      quiz,
      answers: {},
      startedAt: Date.now(),
      timeRemaining: quiz.durationMinutes * 60,
    });
    setQuizState('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const submitQuiz = useCallback((answers: Record<string, string>) => {
    if (!session) return;
    setSession(prev => prev ? { ...prev, answers, finishedAt: Date.now() } : prev);
    setQuizState('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [session]);

  const retryQuiz = useCallback(() => {
    if (!session) return;
    setSession(prev => prev ? {
      ...prev,
      answers: {},
      startedAt: Date.now(),
      finishedAt: undefined,
      timeRemaining: prev.quiz.durationMinutes * 60,
    } : prev);
    setQuizState('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [session]);

  const backToListing = useCallback(() => {
    setSession(null);
    setQuizState('listing');
  }, []);

  const filteredQuizzes = MOCK_QUIZZES.filter(q => {
    if (filterSubject && q.subject !== filterSubject) return false;
    if (filterDifficulty && q.difficulty !== filterDifficulty) return false;
    if (searchQuery) {
      const sq = searchQuery.toLowerCase();
      return q.title.toLowerCase().includes(sq) || q.chapter.toLowerCase().includes(sq);
    }
    return true;
  });

  if (quizState === 'active' && session) {
    return (
      <AppLayout showFooter={false}>
        <QuizActiveView
          session={session}
          onSubmit={submitQuiz}
          onExit={backToListing}
        />
      </AppLayout>
    );
  }

  if (quizState === 'result' && session) {
    return (
      <AppLayout>
        <QuizResultView
          session={session}
          onRetry={retryQuiz}
          onBack={backToListing}
        />
      </AppLayout>
    );
  }

  return (
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <ClipboardList size={20} className="text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Quizzes</h1>
        </div>
        <p className="text-muted-foreground">
          Timed chapter-wise quizzes with instant scoring. {MOCK_QUIZZES.length} quizzes available.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-8">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search quizzes..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <select
          value={filterSubject}
          onChange={e => setFilterSubject(e.target.value as Subject | '')}
          className="px-3 py-2.5 rounded-xl bg-card border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">All Subjects</option>
          {SUBJECTS.map(s => <option key={`quiz-filter-subj-${s.value}`} value={s.value}>{s.label}</option>)}
        </select>
        <select
          value={filterDifficulty}
          onChange={e => setFilterDifficulty(e.target.value as Difficulty | '')}
          className="px-3 py-2.5 rounded-xl bg-card border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">All Difficulties</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map(i => <QuizCardSkeleton key={`quiz-skeleton-${i}`} />)}
        </div>
      ) : filteredQuizzes.length === 0 ? (
        <EmptyState type="quiz" action={{ label: 'Clear Filters', onClick: () => { setFilterSubject(''); setFilterDifficulty(''); setSearchQuery(''); } }} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-5">
          {filteredQuizzes.map(quiz => (
            <QuizCard key={`quiz-listing-${quiz.id}`} quiz={quiz} onStart={startQuiz} />
          ))}
        </div>
      )}
    </div>
  );
}