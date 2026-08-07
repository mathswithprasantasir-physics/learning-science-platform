'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { MOCK_MCQS } from '@/data/mockData';
import { SUBJECTS, BOARDS } from '@/constants';
import type { Subject, Board, Difficulty, MCQ } from '@/types';
import SubjectBadge from '@/components/ui/SubjectBadge';
import DifficultyBadge from '@/components/ui/DifficultyBadge';
import BoardBadge from '@/components/ui/BoardBadge';
import EmptyState from '@/components/ui/EmptyState';
import { MCQSkeleton } from '@/components/ui/LoadingSkeleton';
import { CheckCircle2, XCircle, ChevronDown, ChevronUp, Search, HelpCircle, RotateCcw, Filter,  } from 'lucide-react';

interface MCQAnswerState {
  selectedId: string;
  isCorrect: boolean;
  showExplanation: boolean;
}

export default function MCQPageClient() {
  const [answers, setAnswers] = useState<Record<string, MCQAnswerState>>({});
  const [filterSubject, setFilterSubject] = useState<Subject | ''>('');
  const [filterBoard, setFilterBoard] = useState<Board | ''>('');
  const [filterDifficulty, setFilterDifficulty] = useState<Difficulty | ''>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading] = useState(false);

  const filteredMCQs = useMemo(() => {
    return MOCK_MCQS.filter(q => {
      if (filterSubject && q.subject !== filterSubject) return false;
      if (filterBoard && q.board !== filterBoard) return false;
      if (filterDifficulty && q.difficulty !== filterDifficulty) return false;
      if (searchQuery) {
        const sq = searchQuery.toLowerCase();
        return (
          q.question.toLowerCase().includes(sq) ||
          q.chapter.toLowerCase().includes(sq) ||
          q.tags.some(t => t.includes(sq))
        );
      }
      return true;
    });
  }, [filterSubject, filterBoard, filterDifficulty, searchQuery]);

  const answeredCount = Object.keys(answers).length;
  const correctCount = Object.values(answers).filter(a => a.isCorrect).length;
  const score = answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0;

  const handleAnswer = useCallback((mcqId: string, optionId: string, isCorrect: boolean) => {
    if (answers[mcqId]) return;
    setAnswers(prev => ({
      ...prev,
      [mcqId]: { selectedId: optionId, isCorrect, showExplanation: true },
    }));
  }, [answers]);

  const toggleExplanation = useCallback((mcqId: string) => {
    setAnswers(prev => {
      if (!prev[mcqId]) return prev;
      return {
        ...prev,
        [mcqId]: { ...prev[mcqId], showExplanation: !prev[mcqId].showExplanation },
      };
    });
  }, []);

  const resetAll = useCallback(() => {
    setAnswers({});
  }, []);

  const clearFilters = useCallback(() => {
    setFilterSubject('');
    setFilterBoard('');
    setFilterDifficulty('');
    setSearchQuery('');
  }, []);

  return (
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-10">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <HelpCircle size={20} className="text-primary" />
            <h1 className="text-2xl font-bold text-foreground">MCQ Practice</h1>
          </div>
          <p className="text-muted-foreground">
            {filteredMCQs.length} questions · Instant feedback · Detailed explanations
          </p>
        </div>

        {/* Score Tracker */}
        {answeredCount > 0 && (
          <div className="flex items-center gap-4 bg-card border border-border rounded-xl px-5 py-3 card-shadow">
            <div className="text-center">
              <p className="text-2xl font-extrabold text-foreground tabular-nums">{score}%</p>
              <p className="text-[11px] text-muted-foreground">Score</p>
            </div>
            <div className="w-px h-10 bg-border" />
            <div className="text-center">
              <p className="text-lg font-bold text-success tabular-nums">{correctCount}</p>
              <p className="text-[11px] text-muted-foreground">Correct</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-danger tabular-nums">{answeredCount - correctCount}</p>
              <p className="text-[11px] text-muted-foreground">Wrong</p>
            </div>
            <button
              onClick={resetAll}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
              aria-label="Reset all answers"
              title="Reset all answers"
            >
              <RotateCcw size={15} />
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filter Sidebar */}
        <aside className="lg:w-60 xl:w-64 flex-shrink-0 space-y-5" aria-label="Filter MCQs">
          <div className="bg-card border border-border rounded-xl p-5 card-shadow sticky top-24">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Filter size={14} /> Filters
              </h2>
              {(filterSubject || filterBoard || filterDifficulty || searchQuery) && (
                <button
                  onClick={clearFilters}
                  className="text-xs text-danger hover:underline"
                >
                  Clear all
                </button>
              )}
            </div>

            {/* Search */}
            <div className="relative mb-4">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search questions..."
                className="w-full pl-8 pr-3 py-2 rounded-lg bg-muted border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            {/* Board */}
            <div className="mb-4">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">Board</p>
              <select
                value={filterBoard}
                onChange={e => setFilterBoard(e.target.value as Board | '')}
                className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">All Boards</option>
                {BOARDS.map(b => <option key={`mcq-board-${b.value}`} value={b.value}>{b.label}</option>)}
              </select>
            </div>

            {/* Subject */}
            <div className="mb-4">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">Subject</p>
              <div className="space-y-1">
                {SUBJECTS.map(s => (
                  <button
                    key={`mcq-filter-subj-${s.value}`}
                    onClick={() => setFilterSubject(filterSubject === s.value ? '' : s.value)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-all duration-150 ${
                      filterSubject === s.value
                        ? 'bg-primary-light text-primary font-semibold' :'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty */}
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">Difficulty</p>
              <div className="flex flex-col gap-1">
                {(['Easy', 'Medium', 'Hard'] as Difficulty[]).map(d => (
                  <button
                    key={`mcq-diff-${d}`}
                    onClick={() => setFilterDifficulty(filterDifficulty === d ? '' : d)}
                    className={`text-left px-2.5 py-1.5 rounded-lg text-xs transition-all duration-150 ${
                      filterDifficulty === d
                        ? 'bg-primary-light text-primary font-semibold' :'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* MCQ List */}
        <div className="flex-1 min-w-0">
          {loading ? (
            <div className="space-y-5">
              {[1, 2, 3].map(i => <MCQSkeleton key={`mcq-skeleton-${i}`} />)}
            </div>
          ) : filteredMCQs.length === 0 ? (
            <EmptyState type="mcq" action={{ label: 'Clear Filters', onClick: clearFilters }} />
          ) : (
            <div className="space-y-5">
              <p className="text-sm text-muted-foreground">
                Showing <strong className="text-foreground">{filteredMCQs.length}</strong> questions
              </p>

              {filteredMCQs.map((mcq, qIdx) => {
                const answerState = answers[mcq.id];
                const isAnswered = Boolean(answerState);

                return (
                  <div
                    key={`mcq-card-${mcq.id}`}
                    className="bg-card border border-border rounded-xl p-6 card-shadow animate-slide-up"
                    style={{ animationDelay: `${qIdx * 0.04}s` }}
                  >
                    {/* Question Header */}
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="flex flex-wrap gap-1.5 items-center">
                        <span className="text-xs font-bold text-muted-foreground">Q{qIdx + 1}</span>
                        <BoardBadge board={mcq.board} size="sm" />
                        <SubjectBadge subject={mcq.subject} size="sm" />
                        <DifficultyBadge difficulty={mcq.difficulty} size="sm" />
                        <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">
                          Ch. {mcq.chapter}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-[10px] text-muted-foreground">{mcq.marks}m</span>
                        {isAnswered && (
                          answerState.isCorrect
                            ? <CheckCircle2 size={16} className="text-success" />
                            : <XCircle size={16} className="text-danger" />
                        )}
                      </div>
                    </div>

                    {/* Question Text */}
                    <p className="text-sm font-medium text-foreground leading-relaxed mb-5">
                      {mcq.question}
                    </p>

                    {/* Options */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-4">
                      {mcq.options.map((option, optIdx) => {
                        let optClass = 'bg-muted border-border text-foreground hover:border-primary/50 hover:bg-primary-light/60 cursor-pointer';
                        if (isAnswered) {
                          if (option.isCorrect) {
                            optClass = 'bg-success-light border-success text-success cursor-default';
                          } else if (answerState.selectedId === option.id && !option.isCorrect) {
                            optClass = 'bg-danger-light border-danger text-danger cursor-default';
                          } else {
                            optClass = 'bg-muted border-border text-muted-foreground cursor-default opacity-50';
                          }
                        }

                        return (
                          <button
                            key={`mcq-page-opt-${option.id}`}
                            onClick={() => handleAnswer(mcq.id, option.id, option.isCorrect)}
                            disabled={isAnswered}
                            className={`text-left flex items-center gap-2.5 px-4 py-3 rounded-xl border transition-all duration-150 text-sm ${optClass}`}
                          >
                            <span className={`flex-shrink-0 w-5 h-5 rounded-full border text-[10px] font-bold flex items-center justify-center ${
                              isAnswered && option.isCorrect
                                ? 'bg-success text-white border-success'
                                : isAnswered && answerState.selectedId === option.id && !option.isCorrect
                                  ? 'bg-danger text-white border-danger' :'border-current'
                            }`}>
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            {option.text}
                            {isAnswered && option.isCorrect && (
                              <CheckCircle2 size={14} className="ml-auto flex-shrink-0" />
                            )}
                            {isAnswered && answerState.selectedId === option.id && !option.isCorrect && (
                              <XCircle size={14} className="ml-auto flex-shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Explanation */}
                    {isAnswered && (
                      <div className="animate-fade-in">
                        <button
                          onClick={() => toggleExplanation(mcq.id)}
                          className="flex items-center gap-2 text-xs font-semibold text-info hover:text-info/80 transition-colors mb-2"
                          aria-expanded={answerState.showExplanation}
                        >
                          {answerState.showExplanation ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                          {answerState.showExplanation ? 'Hide' : 'Show'} Explanation
                        </button>
                        {answerState.showExplanation && (
                          <div className="p-4 bg-info-light rounded-xl border border-info/20 animate-fade-in">
                            <p className="text-sm text-foreground leading-relaxed">
                              <strong className="text-info">Explanation: </strong>
                              {mcq.explanation}
                            </p>
                            {mcq.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 mt-3">
                                {mcq.tags.map(tag => (
                                  <span key={`tag-${mcq.id}-${tag}`} className="text-[10px] bg-info/10 text-info px-2 py-0.5 rounded-full">
                                    #{tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}