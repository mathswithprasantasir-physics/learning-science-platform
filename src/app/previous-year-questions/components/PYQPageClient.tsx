'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { MOCK_PYQS } from '@/data/mockData';
import { SUBJECTS, BOARDS } from '@/constants';
import type { Subject, Board, Difficulty, PYQ } from '@/types';
import SubjectBadge from '@/components/ui/SubjectBadge';
import BoardBadge from '@/components/ui/BoardBadge';
import DifficultyBadge from '@/components/ui/DifficultyBadge';
import EmptyState from '@/components/ui/EmptyState';
import { PYQSkeleton } from '@/components/ui/LoadingSkeleton';
import { Archive, Search, ChevronDown, ChevronUp, Calendar, BookOpen, Lightbulb, Filter, Tag,  } from 'lucide-react';

const YEARS = [2024, 2023, 2022, 2021, 2020, 2019, 2018];

export default function PYQPageClient() {
  const [filterBoard, setFilterBoard] = useState<Board | ''>('');
  const [filterSubject, setFilterSubject] = useState<Subject | ''>('');
  const [filterYear, setFilterYear] = useState<number | ''>('');
  const [filterDifficulty, setFilterDifficulty] = useState<Difficulty | ''>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loading] = useState(false);

  const filteredPYQs = useMemo(() => {
    return MOCK_PYQS.filter(q => {
      if (filterBoard && q.board !== filterBoard) return false;
      if (filterSubject && q.subject !== filterSubject) return false;
      if (filterYear && q.year !== filterYear) return false;
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
  }, [filterBoard, filterSubject, filterYear, filterDifficulty, searchQuery]);

  const clearFilters = useCallback(() => {
    setFilterBoard('');
    setFilterSubject('');
    setFilterYear('');
    setFilterDifficulty('');
    setSearchQuery('');
  }, []);

  const activeFilterCount = [filterBoard, filterSubject, filterYear, filterDifficulty].filter(Boolean).length;

  const toggleExpand = (id: string) => setExpandedId(prev => prev === id ? null : id);

  // Stats by year
  const yearStats = useMemo(() => {
    return YEARS.map(y => ({
      year: y,
      count: MOCK_PYQS.filter(q => q.year === y).length,
    }));
  }, []);

  return (
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-10">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Archive size={20} className="text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Previous Year Questions</h1>
        </div>
        <p className="text-muted-foreground">
          Actual board exam questions from 2018–2024. Study the pattern, marks, and expected answers.
        </p>
      </div>

      {/* Year Quick Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setFilterYear('')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
            filterYear === '' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'
          }`}
        >
          All Years
        </button>
        {yearStats.map(({ year, count }) => (
          <button
            key={`year-chip-${year}`}
            onClick={() => setFilterYear(filterYear === year ? '' : year)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              filterYear === year ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'
            }`}
          >
            <Calendar size={10} /> {year}
            <span className="opacity-70">({count})</span>
          </button>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filter Sidebar */}
        <aside className="lg:w-60 xl:w-64 flex-shrink-0" aria-label="Filter PYQs">
          <div className="bg-card border border-border rounded-xl p-5 card-shadow sticky top-24 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Filter size={14} /> Filters
                {activeFilterCount > 0 && (
                  <span className="bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {activeFilterCount}
                  </span>
                )}
              </h2>
              {activeFilterCount > 0 && (
                <button onClick={clearFilters} className="text-xs text-danger hover:underline">Clear</button>
              )}
            </div>

            {/* Search */}
            <div className="relative">
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
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">Board</p>
              <div className="space-y-1">
                {BOARDS.map(b => (
                  <button
                    key={`pyq-filter-board-${b.value}`}
                    onClick={() => setFilterBoard(filterBoard === b.value ? '' : b.value)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-all ${
                      filterBoard === b.value ? 'bg-primary-light text-primary font-semibold' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Subject */}
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">Subject</p>
              <div className="space-y-1">
                {SUBJECTS.map(s => (
                  <button
                    key={`pyq-filter-subj-${s.value}`}
                    onClick={() => setFilterSubject(filterSubject === s.value ? '' : s.value)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-all ${
                      filterSubject === s.value ? 'bg-primary-light text-primary font-semibold' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
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
              <div className="space-y-1">
                {(['Easy', 'Medium', 'Hard'] as Difficulty[]).map(d => (
                  <button
                    key={`pyq-filter-diff-${d}`}
                    onClick={() => setFilterDifficulty(filterDifficulty === d ? '' : d)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-all ${
                      filterDifficulty === d ? 'bg-primary-light text-primary font-semibold' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* PYQ List */}
        <div className="flex-1 min-w-0">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map(i => <PYQSkeleton key={`pyq-skeleton-${i}`} />)}
            </div>
          ) : filteredPYQs.length === 0 ? (
            <EmptyState type="pyq" action={{ label: 'Clear Filters', onClick: clearFilters }} />
          ) : (
            <>
              <p className="text-sm text-muted-foreground mb-4">
                Showing <strong className="text-foreground">{filteredPYQs.length}</strong> questions
              </p>
              <div className="space-y-3">
                {filteredPYQs.map((pyq, idx) => {
                  const isExpanded = expandedId === pyq.id;

                  return (
                    <div
                      key={`pyq-item-${pyq.id}`}
                      className="bg-card border border-border rounded-xl overflow-hidden card-shadow transition-all duration-200 hover:border-primary/30 animate-slide-up"
                      style={{ animationDelay: `${idx * 0.03}s` }}
                    >
                      {/* Question Row */}
                      <button
                        onClick={() => toggleExpand(pyq.id)}
                        className="w-full text-left p-5"
                        aria-expanded={isExpanded}
                      >
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div className="flex flex-wrap gap-1.5 items-center">
                            <BoardBadge board={pyq.board} size="sm" />
                            <SubjectBadge subject={pyq.subject} size="sm" />
                            <span className="inline-flex items-center gap-1 text-[10px] font-medium bg-muted text-muted-foreground px-1.5 py-0.5 rounded-full">
                              <Calendar size={9} /> {pyq.year}
                            </span>
                            <DifficultyBadge difficulty={pyq.difficulty} size="sm" />
                            <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">
                              {pyq.marks} mark{pyq.marks > 1 ? 's' : ''}
                            </span>
                            {pyq.isLong && (
                              <span className="text-[10px] text-accent bg-accent/10 px-1.5 py-0.5 rounded-full font-medium">
                                Long Answer
                              </span>
                            )}
                          </div>
                          <div className="flex-shrink-0">
                            {isExpanded
                              ? <ChevronUp size={16} className="text-muted-foreground" />
                              : <ChevronDown size={16} className="text-muted-foreground" />
                            }
                          </div>
                        </div>

                        <p className="text-sm font-medium text-foreground leading-relaxed mb-2">
                          {pyq.question}
                        </p>
                        <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                          <BookOpen size={10} /> {pyq.chapter} · Class {pyq.classLevel}
                        </p>
                      </button>

                      {/* Expanded Content */}
                      {isExpanded && (
                        <div className="px-5 pb-5 border-t border-border pt-4 space-y-4 animate-fade-in">
                          {/* Tags */}
                          {pyq.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                              {pyq.tags.map(tag => (
                                <span key={`pyq-tag-${pyq.id}-${tag}`} className="inline-flex items-center gap-1 text-[10px] text-primary bg-primary-light px-2 py-0.5 rounded-full">
                                  <Tag size={8} /> {tag}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Model Answer Hint */}
                          {pyq.modelAnswer && (
                            <div className="p-4 bg-success-light rounded-xl border border-success/20">
                              <div className="flex items-center gap-2 mb-2">
                                <Lightbulb size={14} className="text-success" />
                                <span className="text-xs font-semibold text-success">Model Answer Hint</span>
                              </div>
                              <p className="text-sm text-foreground leading-relaxed">{pyq.modelAnswer}</p>
                            </div>
                          )}

                          {/* Marks Breakdown */}
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <BookOpen size={11} /> Full marks: {pyq.marks}
                            </span>
                            <span>·</span>
                            <span>Board: {pyq.board}</span>
                            <span>·</span>
                            <span>Year: {pyq.year}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}