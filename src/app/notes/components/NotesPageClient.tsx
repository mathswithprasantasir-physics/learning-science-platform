'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { MOCK_NOTES } from '@/data/mockData';
import { BOARDS, SUBJECTS, DIFFICULTY_CONFIG } from '@/constants';
import type { Board, Subject, Difficulty } from '@/types';
import NoteCard from '@/components/ui/NoteCard';
import EmptyState from '@/components/ui/EmptyState';
import { NoteCardSkeleton } from '@/components/ui/LoadingSkeleton';
import SubjectBadge from '@/components/ui/SubjectBadge';
import { Search, SlidersHorizontal, List, X, BookOpen, Filter, LayoutGrid, Rows,  } from 'lucide-react';

type SortOption = 'newest' | 'popular' | 'readTime';
type ViewMode = 'grid' | 'list';

interface FilterState {
  board: Board | '';
  subject: Subject | '';
  classLevel: number | '';
  difficulty: Difficulty | '';
  search: string;
}

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'newest', label: 'Newest First' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'readTime', label: 'Quick Reads' },
];

export default function NotesPageClient() {
  const [filters, setFilters] = useState<FilterState>({
    board: '', subject: '', classLevel: '', difficulty: '', search: '',
  });
  const [sort, setSort] = useState<SortOption>('newest');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [loading] = useState(false);

  const updateFilter = useCallback(<K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({ board: '', subject: '', classLevel: '', difficulty: '', search: '' });
  }, []);

  const activeFilterCount = [filters.board, filters.subject, filters.classLevel, filters.difficulty]
    .filter(Boolean).length;

  const availableClasses = useMemo(() => {
    if (!filters.board) return [6, 7, 8, 9, 10, 11, 12];
    return BOARDS.find(b => b.value === filters.board)?.classes ?? [];
  }, [filters.board]);

  const filteredNotes = useMemo(() => {
    let result = MOCK_NOTES.filter(note => {
      if (filters.board && note.board !== filters.board) return false;
      if (filters.subject && note.subject !== filters.subject) return false;
      if (filters.classLevel && note.classLevel !== filters.classLevel) return false;
      if (filters.difficulty && note.difficulty !== filters.difficulty) return false;
      if (filters.search) {
        const q = filters.search.toLowerCase();
        return (
          note.title.toLowerCase().includes(q) ||
          note.chapter.toLowerCase().includes(q) ||
          note.excerpt.toLowerCase().includes(q) ||
          note.tags.some(t => t.includes(q))
        );
      }
      return true;
    });

    if (sort === 'popular') result = [...result].sort((a, b) => b.viewCount - a.viewCount);
    else if (sort === 'readTime') result = [...result].sort((a, b) => a.readTime - b.readTime);
    else result = [...result].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

    return result;
  }, [filters, sort]);

  const FilterSidebar = (
    <aside className="w-full space-y-6" aria-label="Filter notes">
      {/* Board */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Board</h3>
        <div className="space-y-1">
          {BOARDS.map(b => (
            <button
              key={`filter-board-${b.value}`}
              onClick={() => updateFilter('board', filters.board === b.value ? '' : b.value)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-150 ${
                filters.board === b.value
                  ? 'bg-primary-light text-primary font-semibold' :'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              {b.label}
            </button>
          ))}
        </div>
      </div>

      {/* Subject */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Subject</h3>
        <div className="space-y-1">
          {SUBJECTS.map(s => (
            <button
              key={`filter-subject-${s.value}`}
              onClick={() => updateFilter('subject', filters.subject === s.value ? '' : s.value)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-150 flex items-center gap-2 ${
                filters.subject === s.value
                  ? 'bg-primary-light text-primary font-semibold' :'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <SubjectBadge subject={s.value} size="sm" />
            </button>
          ))}
        </div>
      </div>

      {/* Class */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Class</h3>
        <div className="grid grid-cols-4 gap-1.5">
          {availableClasses.map(cls => (
            <button
              key={`filter-class-${cls}`}
              onClick={() => updateFilter('classLevel', filters.classLevel === cls ? '' : cls)}
              className={`py-1.5 rounded-lg text-xs font-medium transition-all duration-150 ${
                filters.classLevel === cls
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              {cls}
            </button>
          ))}
        </div>
      </div>

      {/* Difficulty */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Difficulty</h3>
        <div className="space-y-1">
          {(Object.entries(DIFFICULTY_CONFIG) as [Difficulty, { label: string; className: string }][]).map(([key, val]) => (
            <button
              key={`filter-diff-${key}`}
              onClick={() => updateFilter('difficulty', filters.difficulty === key ? '' : key)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-150 flex items-center gap-2 ${
                filters.difficulty === key
                  ? 'bg-primary-light text-primary font-semibold' :'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${val.className}`}>{val.label}</span>
            </button>
          ))}
        </div>
      </div>

      {activeFilterCount > 0 && (
        <button
          onClick={clearFilters}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:text-danger hover:border-danger transition-all"
        >
          <X size={14} /> Clear all filters
        </button>
      )}
    </aside>
  );

  return (
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-10">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <BookOpen size={20} className="text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Study Notes</h1>
        </div>
        <p className="text-muted-foreground">
          {filteredNotes.length.toLocaleString('en-IN')} notes across all boards and subjects
        </p>
      </div>

      {/* Search + Controls Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={filters.search}
            onChange={e => updateFilter('search', e.target.value)}
            placeholder="Search notes by title, chapter, topic..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm"
            aria-label="Search notes"
          />
          {filters.search && (
            <button
              onClick={() => updateFilter('search', '')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Mobile filter toggle */}
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="lg:hidden flex items-center gap-2 px-3 py-2.5 rounded-xl bg-card border border-border text-sm text-muted-foreground hover:text-foreground transition-all"
          >
            <Filter size={14} />
            Filters
            {activeFilterCount > 0 && (
              <span className="bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Sidebar toggle desktop */}
          <button
            onClick={() => setSidebarOpen(p => !p)}
            className="hidden lg:flex items-center gap-2 px-3 py-2.5 rounded-xl bg-card border border-border text-sm text-muted-foreground hover:text-foreground transition-all"
            aria-label={sidebarOpen ? 'Hide filters' : 'Show filters'}
          >
            <SlidersHorizontal size={14} />
            {sidebarOpen ? 'Hide' : 'Filters'}
          </button>

          {/* Sort */}
          <select
            value={sort}
            onChange={e => setSort(e.target.value as SortOption)}
            className="px-3 py-2.5 rounded-xl bg-card border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            aria-label="Sort notes"
          >
            {SORT_OPTIONS.map(opt => (
              <option key={`sort-${opt.value}`} value={opt.value}>{opt.label}</option>
            ))}
          </select>

          {/* View toggle */}
          <div className="flex items-center bg-card border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2.5 transition-all ${viewMode === 'grid' ? 'bg-primary-light text-primary' : 'text-muted-foreground hover:text-foreground'}`}
              aria-label="Grid view"
              aria-pressed={viewMode === 'grid'}
            >
              <LayoutGrid size={15} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2.5 transition-all ${viewMode === 'list' ? 'bg-primary-light text-primary' : 'text-muted-foreground hover:text-foreground'}`}
              aria-label="List view"
              aria-pressed={viewMode === 'list'}
            >
              <Rows size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Active Filter Chips */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2 mb-5">
          {filters.board && (
            <span className="inline-flex items-center gap-1.5 text-xs bg-primary-light text-primary px-2.5 py-1 rounded-full font-medium">
              {filters.board}
              <button onClick={() => updateFilter('board', '')} aria-label="Remove board filter"><X size={11} /></button>
            </span>
          )}
          {filters.subject && (
            <span className="inline-flex items-center gap-1.5 text-xs bg-primary-light text-primary px-2.5 py-1 rounded-full font-medium">
              {filters.subject}
              <button onClick={() => updateFilter('subject', '')} aria-label="Remove subject filter"><X size={11} /></button>
            </span>
          )}
          {filters.classLevel && (
            <span className="inline-flex items-center gap-1.5 text-xs bg-primary-light text-primary px-2.5 py-1 rounded-full font-medium">
              Class {filters.classLevel}
              <button onClick={() => updateFilter('classLevel', '')} aria-label="Remove class filter"><X size={11} /></button>
            </span>
          )}
          {filters.difficulty && (
            <span className="inline-flex items-center gap-1.5 text-xs bg-primary-light text-primary px-2.5 py-1 rounded-full font-medium">
              {filters.difficulty}
              <button onClick={() => updateFilter('difficulty', '')} aria-label="Remove difficulty filter"><X size={11} /></button>
            </span>
          )}
        </div>
      )}

      <div className="flex gap-8">
        {/* Desktop Sidebar */}
        {sidebarOpen && (
          <div className="hidden lg:block w-56 xl:w-64 flex-shrink-0">
            <div className="sticky top-24 bg-card border border-border rounded-xl p-5 card-shadow">
              {FilterSidebar}
            </div>
          </div>
        )}

        {/* Notes Grid */}
        <div className="flex-1 min-w-0">
          {loading ? (
            <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
              {[1, 2, 3, 4, 5, 6].map(i => <NoteCardSkeleton key={`note-skeleton-${i}`} />)}
            </div>
          ) : filteredNotes.length === 0 ? (
            <EmptyState
              type="notes"
              action={{ label: 'Clear Filters', onClick: clearFilters }}
            />
          ) : (
            <>
              <p className="text-sm text-muted-foreground mb-4">
                Showing <strong className="text-foreground">{filteredNotes.length}</strong> notes
              </p>
              <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
                {filteredNotes.map(note => (
                  <NoteCard
                    key={`notes-page-${note.id}`}
                    note={note}
                    variant={viewMode === 'list' ? 'compact' : 'default'}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <div
        className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${mobileSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setMobileSidebarOpen(false)}
        aria-hidden="true"
      />
      <div
        className={`fixed bottom-0 left-0 right-0 z-[60] bg-card border-t border-border rounded-t-2xl p-6 max-h-[80vh] overflow-y-auto scrollbar-thin transition-transform duration-300 lg:hidden ${mobileSidebarOpen ? 'translate-y-0' : 'translate-y-full'}`}
        role="dialog"
        aria-modal="true"
        aria-label="Filter notes"
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-foreground">Filter Notes</h2>
          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
            aria-label="Close filters"
          >
            <X size={18} />
          </button>
        </div>
        {FilterSidebar}
        <button
          onClick={() => setMobileSidebarOpen(false)}
          className="w-full mt-4 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold"
        >
          Apply Filters ({filteredNotes.length} results)
        </button>
      </div>
    </div>
  );
}