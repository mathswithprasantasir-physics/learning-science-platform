'use client';

import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { MOCK_NOTES, MOCK_MCQS, MOCK_QUIZZES, MOCK_PYQS, MOCK_FORMULAS } from '@/data/mockData';
import type { SearchResult, ContentType, Subject, Board } from '@/types';
import { SUBJECTS, BOARDS } from '@/constants';
import SubjectBadge from '@/components/ui/SubjectBadge';
import BoardBadge from '@/components/ui/BoardBadge';
import DifficultyBadge from '@/components/ui/DifficultyBadge';
import EmptyState from '@/components/ui/EmptyState';
import { SkeletonBlock } from '@/components/ui/LoadingSkeleton';
import {
  Search, X, FileText, HelpCircle, ClipboardList,
  Archive, Sigma, Clock, ArrowRight, Keyboard, TrendingUp,
} from 'lucide-react';
import Link from 'next/link';

const RECENT_SEARCHES_KEY = 'ls-recent-searches';
const MAX_RECENT = 8;

const CONTENT_TYPE_CONFIG: Record<ContentType, { label: string; icon: React.ReactNode; color: string }> = {
  note: { label: 'Notes', icon: <FileText size={14} />, color: 'text-primary' },
  mcq: { label: 'MCQs', icon: <HelpCircle size={14} />, color: 'text-accent' },
  quiz: { label: 'Quizzes', icon: <ClipboardList size={14} />, color: 'text-secondary' },
  pyq: { label: 'PYQs', icon: <Archive size={14} />, color: 'text-warning' },
  formula: { label: 'Formulas', icon: <Sigma size={14} />, color: 'text-success' },
};

const TRENDING_SEARCHES = [
  'Newton\'s Laws of Motion', 'Quadratic Equations', 'Periodic Table Trends',
  'Cell Organelles', 'Trigonometric Identities', 'Electromagnetic Induction',
  'Carbon Compounds', 'Photosynthesis Calvin Cycle',
];

function buildSearchIndex(): SearchResult[] {
  const results: SearchResult[] = [];

  MOCK_NOTES.forEach(n => results.push({
    id: n.id,
    type: 'note',
    title: n.title,
    subject: n.subject,
    board: n.board,
    classLevel: n.classLevel,
    chapter: n.chapter,
    excerpt: n.excerpt,
    difficulty: n.difficulty,
    href: `/notes/${n.id}`,
  }));

  MOCK_MCQS.forEach(q => results.push({
    id: q.id,
    type: 'mcq',
    title: q.question,
    subject: q.subject,
    board: q.board,
    classLevel: q.classLevel,
    chapter: q.chapter,
    difficulty: q.difficulty,
    href: `/mcq?q=${q.id}`,
  }));

  MOCK_QUIZZES.forEach(qz => results.push({
    id: qz.id,
    type: 'quiz',
    title: qz.title,
    subject: qz.subject,
    board: qz.board,
    classLevel: qz.classLevel,
    chapter: qz.chapter,
    excerpt: qz.description,
    difficulty: qz.difficulty,
    href: `/quiz?start=${qz.id}`,
  }));

  MOCK_PYQS.forEach(p => results.push({
    id: p.id,
    type: 'pyq',
    title: p.question,
    subject: p.subject,
    board: p.board,
    classLevel: p.classLevel,
    chapter: p.chapter,
    difficulty: p.difficulty,
    href: `/previous-year-questions?id=${p.id}`,
  }));

  MOCK_FORMULAS.forEach(f => results.push({
    id: f.id,
    type: 'formula',
    title: f.title,
    subject: f.subject,
    board: 'CBSE',
    classLevel: 11,
    chapter: f.chapter,
    excerpt: f.expression,
    href: `/notes?type=formula&id=${f.id}`,
  }));

  return results;
}

const SEARCH_INDEX = buildSearchIndex();

export default function SearchPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);

  const initialQuery = searchParams.get('q') ?? '';
  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [filterType, setFilterType] = useState<ContentType | ''>('');
  const [filterSubject, setFilterSubject] = useState<Subject | ''>('');
  const [filterBoard, setFilterBoard] = useState<Board | ''>('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Load recent searches
  useEffect(() => {
    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (stored) setRecentSearches(JSON.parse(stored));
    } catch {}
  }, []);

  // Debounce query
  useEffect(() => {
    setIsSearching(true);
    const t = setTimeout(() => {
      setDebouncedQuery(query);
      setIsSearching(false);
    }, 280);
    return () => clearTimeout(t);
  }, [query]);

  // Focus on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const saveRecentSearch = useCallback((q: string) => {
    if (!q.trim()) return;
    setRecentSearches(prev => {
      const updated = [q, ...prev.filter(s => s !== q)].slice(0, MAX_RECENT);
      try { localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated)); } catch {}
      return updated;
    });
  }, []);

  const handleSearch = useCallback((q: string) => {
    setQuery(q);
    if (q.trim()) {
      saveRecentSearch(q.trim());
      router.replace(`/search?q=${encodeURIComponent(q.trim())}`, { scroll: false });
    }
  }, [saveRecentSearch, router]);

  const clearRecent = useCallback(() => {
    setRecentSearches([]);
    try { localStorage.removeItem(RECENT_SEARCHES_KEY); } catch {}
  }, []);

  const results = useMemo(() => {
    if (!debouncedQuery.trim()) return [];
    const q = debouncedQuery.toLowerCase();
    return SEARCH_INDEX.filter(item => {
      if (filterType && item.type !== filterType) return false;
      if (filterSubject && item.subject !== filterSubject) return false;
      if (filterBoard && item.board !== filterBoard) return false;
      return (
        item.title.toLowerCase().includes(q) ||
        item.chapter.toLowerCase().includes(q) ||
        (item.excerpt ?? '').toLowerCase().includes(q)
      );
    });
  }, [debouncedQuery, filterType, filterSubject, filterBoard]);

  const groupedResults = useMemo(() => {
    const groups: Partial<Record<ContentType, SearchResult[]>> = {};
    results.forEach(r => {
      if (!groups[r.type]) groups[r.type] = [];
      groups[r.type]!.push(r);
    });
    return groups;
  }, [results]);

  const typeCounts = useMemo(() => {
    const counts: Partial<Record<ContentType, number>> = {};
    results.forEach(r => { counts[r.type] = (counts[r.type] ?? 0) + 1; });
    return counts;
  }, [results]);

  const showEmpty = debouncedQuery.trim() && !isSearching && results.length === 0;
  const showResults = debouncedQuery.trim() && !isSearching && results.length > 0;
  const showLanding = !debouncedQuery.trim();

  const highlightMatch = (text: string, q: string) => {
    if (!q.trim()) return text;
    const idx = text.toLowerCase().indexOf(q.toLowerCase());
    if (idx === -1) return text;
    return (
      <>
        {text.slice(0, idx)}
        <mark className="bg-warning/30 text-foreground rounded-sm px-0.5">{text.slice(idx, idx + q.length)}</mark>
        {text.slice(idx + q.length)}
      </>
    );
  };

  return (
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-10">
      {/* Search Header */}
      <div className="max-w-2xl mx-auto mb-8">
        <h1 className="text-2xl font-bold text-foreground mb-6 text-center">Search LearningScience</h1>

        {/* Main Search Input */}
        <div className="relative">
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={e => handleSearch(e.target.value)}
            placeholder="Search notes, MCQs, formulas, PYQs..."
            className="w-full pl-12 pr-12 py-4 rounded-2xl bg-card border-2 border-border focus:border-primary text-foreground placeholder:text-muted-foreground focus:outline-none text-base shadow-md transition-colors"
            aria-label="Search study materials"
            autoComplete="off"
          />
          {query && (
            <button
              onClick={() => { setQuery(''); inputRef.current?.focus(); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
          {isSearching && (
            <div className="absolute right-12 top-1/2 -translate-y-1/2">
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>

        {/* Keyboard shortcut hint */}
        <p className="text-center text-xs text-muted-foreground mt-3 flex items-center justify-center gap-1.5">
          <Keyboard size={12} />
          Press <kbd className="bg-muted border border-border rounded px-1 py-0.5 font-mono text-[10px]">⌘K</kbd> from anywhere to search
        </p>
      </div>

      {/* Filter Chips */}
      {debouncedQuery && (
        <div className="max-w-4xl mx-auto mb-6">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs text-muted-foreground">Filter:</span>

            {/* Type filters */}
            {(Object.entries(CONTENT_TYPE_CONFIG) as [ContentType, typeof CONTENT_TYPE_CONFIG[ContentType]][]).map(([type, cfg]) => (
              <button
                key={`search-type-${type}`}
                onClick={() => setFilterType(filterType === type ? '' : type)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  filterType === type
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:text-foreground'
                }`}
              >
                {cfg.icon} {cfg.label}
                {typeCounts[type] !== undefined && (
                  <span className={`ml-0.5 ${filterType === type ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                    ({typeCounts[type]})
                  </span>
                )}
              </button>
            ))}

            <div className="w-px h-5 bg-border mx-1" />

            {/* Subject filter */}
            <select
              value={filterSubject}
              onChange={e => setFilterSubject(e.target.value as Subject | '')}
              className="px-3 py-1.5 rounded-full bg-muted border border-border text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">All Subjects</option>
              {SUBJECTS.map(s => <option key={`search-subj-${s.value}`} value={s.value}>{s.label}</option>)}
            </select>

            {/* Board filter */}
            <select
              value={filterBoard}
              onChange={e => setFilterBoard(e.target.value as Board | '')}
              className="px-3 py-1.5 rounded-full bg-muted border border-border text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">All Boards</option>
              {BOARDS.map(b => <option key={`search-board-${b.value}`} value={b.value}>{b.label}</option>)}
            </select>

            {(filterType || filterSubject || filterBoard) && (
              <button
                onClick={() => { setFilterType(''); setFilterSubject(''); setFilterBoard(''); }}
                className="flex items-center gap-1 text-xs text-danger hover:underline"
              >
                <X size={11} /> Clear filters
              </button>
            )}
          </div>
        </div>
      )}

      {/* Landing State */}
      {showLanding && (
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Clock size={14} className="text-muted-foreground" /> Recent Searches
                </h2>
                <button onClick={clearRecent} className="text-xs text-danger hover:underline">Clear</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map(s => (
                  <button
                    key={`recent-${s}`}
                    onClick={() => handleSearch(s)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted text-muted-foreground hover:text-foreground text-xs transition-all hover:bg-card border border-border"
                  >
                    <Clock size={10} /> {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Trending */}
          <div>
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3">
              <TrendingUp size={14} className="text-primary" /> Trending Searches
            </h2>
            <div className="flex flex-wrap gap-2">
              {TRENDING_SEARCHES.map(s => (
                <button
                  key={`trending-${s}`}
                  onClick={() => handleSearch(s)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary-light text-primary text-xs font-medium hover:bg-primary hover:text-primary-foreground transition-all"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Browse by Type */}
          <div>
            <h2 className="text-sm font-semibold text-foreground mb-3">Browse by Type</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {(Object.entries(CONTENT_TYPE_CONFIG) as [ContentType, typeof CONTENT_TYPE_CONFIG[ContentType]][]).map(([type, cfg]) => (
                <Link
                  key={`browse-type-${type}`}
                  href={type === 'note' ? '/notes' : type === 'mcq' ? '/mcq' : type === 'quiz' ? '/quiz' : type === 'pyq' ? '/previous-year-questions' : '/notes?type=formula'}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl bg-card border border-border hover:border-primary/30 transition-all card-shadow-hover group`}
                >
                  <span className={cfg.color}>{cfg.icon}</span>
                  <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{cfg.label}</span>
                  <ArrowRight size={12} className="ml-auto text-muted-foreground group-hover:text-primary transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isSearching && query.trim() && (
        <div className="max-w-4xl mx-auto space-y-4">
          {[1, 2, 3].map(i => (
            <div key={`search-skeleton-${i}`} className="bg-card border border-border rounded-xl p-4">
              <div className="flex gap-3">
                <SkeletonBlock className="h-8 w-8 flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <SkeletonBlock className="h-4 w-3/4" />
                  <SkeletonBlock className="h-3 w-1/2" />
                  <div className="flex gap-2">
                    <SkeletonBlock className="h-5 w-16" />
                    <SkeletonBlock className="h-5 w-12" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {showEmpty && (
        <div className="max-w-2xl mx-auto">
          <EmptyState
            type="search"
            title={`No results for "${debouncedQuery}"`}
            description="Try different keywords, check spelling, or browse by subject and board."
            action={{ label: 'Clear Search', onClick: () => setQuery('') }}
          />
          {/* Suggestions */}
          <div className="mt-8">
            <p className="text-sm text-muted-foreground mb-3 text-center">Try searching for:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {TRENDING_SEARCHES.slice(0, 5).map(s => (
                <button
                  key={`suggestion-${s}`}
                  onClick={() => handleSearch(s)}
                  className="px-3 py-1.5 rounded-full bg-primary-light text-primary text-xs font-medium hover:bg-primary hover:text-primary-foreground transition-all"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {showResults && (
        <div className="max-w-4xl mx-auto">
          <p className="text-sm text-muted-foreground mb-6">
            Found <strong className="text-foreground">{results.length}</strong> results for{' '}
            <strong className="text-foreground">"{debouncedQuery}"</strong>
          </p>

          <div className="space-y-8">
            {(Object.entries(groupedResults) as [ContentType, SearchResult[]][]).map(([type, items]) => {
              const cfg = CONTENT_TYPE_CONFIG[type];

              return (
                <div key={`result-group-${type}`}>
                  <h2 className={`flex items-center gap-2 text-sm font-semibold mb-3 ${cfg.color}`}>
                    {cfg.icon}
                    {cfg.label}
                    <span className="text-muted-foreground font-normal">({items.length})</span>
                  </h2>

                  <div className="space-y-2">
                    {items.map(item => (
                      <Link
                        key={`result-${item.id}`}
                        href={item.href}
                        className="group flex items-start gap-4 p-4 bg-card border border-border rounded-xl hover:border-primary/40 hover:shadow-md transition-all duration-150"
                      >
                        <div className={`flex-shrink-0 w-9 h-9 rounded-lg bg-primary-light flex items-center justify-center ${cfg.color}`}>
                          {cfg.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-1.5">
                            {highlightMatch(item.title, debouncedQuery)}
                          </p>
                          {item.excerpt && (
                            <p className="text-xs text-muted-foreground line-clamp-1 mb-2">
                              {item.excerpt}
                            </p>
                          )}
                          <div className="flex flex-wrap items-center gap-1.5">
                            <BoardBadge board={item.board} size="sm" />
                            <SubjectBadge subject={item.subject} size="sm" />
                            {item.difficulty && <DifficultyBadge difficulty={item.difficulty} size="sm" />}
                            <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">
                              {item.chapter}
                            </span>
                            <span className="text-[10px] text-muted-foreground">
                              Class {item.classLevel}
                            </span>
                          </div>
                        </div>
                        <ArrowRight size={14} className="flex-shrink-0 text-muted-foreground group-hover:text-primary transition-colors mt-1" />
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}