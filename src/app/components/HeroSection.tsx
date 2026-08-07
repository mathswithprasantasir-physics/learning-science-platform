'use client';

import React, { useState } from 'react';

import { useRouter } from 'next/navigation';
import { Search, Zap, ArrowRight, ChevronDown } from 'lucide-react';
import type { Board } from '@/types';
import { BOARDS } from '@/constants';

const HERO_STATS = [
  { value: '12,400+', label: 'Study Notes' },
  { value: '45,000+', label: 'MCQ Questions' },
  { value: '8,200+', label: 'Previous Year Qs' },
  { value: '500+', label: 'Quizzes' },
];

const POPULAR_SEARCHES = [
  'Newton\'s Laws', 'Quadratic Equations', 'Periodic Table', 'Cell Biology', 'Trigonometry', 'Photosynthesis'
];

export default function HeroSection() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBoard, setSelectedBoard] = useState<Board | ''>('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set('q', searchQuery.trim());
    if (selectedBoard) params.set('board', selectedBoard);
    router.push(`/search?${params.toString()}`);
  };

  return (
    <section
      className="relative overflow-hidden gradient-hero min-h-[92vh] flex items-center"
      aria-label="Hero section"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{ background: 'radial-gradient(circle, #6366F1 0%, transparent 70%)' }}
        />
        <div
          className="absolute bottom-1/4 left-1/4 w-72 h-72 rounded-full opacity-15 blur-3xl"
          style={{ background: 'radial-gradient(circle, #06B6D4 0%, transparent 70%)' }}
        />
        <div
          className="absolute top-10 left-10 w-32 h-32 rounded-full opacity-10 blur-2xl"
          style={{ background: 'radial-gradient(circle, #A78BFA 0%, transparent 70%)' }}
        />
      </div>

      <div className="relative z-10 max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-24">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-8 backdrop-blur-sm">
            <Zap size={13} className="text-yellow-300 fill-yellow-300" />
            <span className="text-white/90 text-sm font-medium">Free for all Indian board students</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white mb-6 leading-[1.1] tracking-tight text-balance">
            Master Your{' '}
            <span
              className="relative"
              style={{
                background: 'linear-gradient(135deg, #A5B4FC 0%, #67E8F9 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Board Exams
            </span>
            {' '}with Science
          </h1>

          <p className="text-lg sm:text-xl text-white/75 mb-10 max-w-2xl mx-auto leading-relaxed">
            Interactive notes, MCQs, quizzes and previous year questions for{' '}
            <strong className="text-white/90">WBBSE, WBCHSE, CBSE, ICSE</strong> and <strong className="text-white/90">ISC</strong> students.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mb-6">
            <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
              <div className="relative flex-1">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search notes, MCQs, formulas..."
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/40 backdrop-blur-sm text-sm"
                  aria-label="Search study materials"
                />
              </div>
              <select
                value={selectedBoard}
                onChange={(e) => setSelectedBoard(e.target.value as Board | '')}
                className="px-4 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-white/40 backdrop-blur-sm text-sm appearance-none cursor-pointer"
                aria-label="Select board"
              >
                <option value="" className="bg-gray-800">All Boards</option>
                {BOARDS.map(b => (
                  <option key={`hero-board-${b.value}`} value={b.value} className="bg-gray-800">{b.label}</option>
                ))}
              </select>
              <button
                type="submit"
                className="px-6 py-3.5 rounded-xl bg-white text-indigo-900 font-semibold text-sm hover:bg-white/90 transition-all duration-150 active:scale-95 flex items-center gap-2 whitespace-nowrap"
              >
                Search <ArrowRight size={15} />
              </button>
            </div>
          </form>

          {/* Popular Searches */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
            <span className="text-white/50 text-sm">Popular:</span>
            {POPULAR_SEARCHES.map((term) => (
              <button
                key={`popular-${term}`}
                onClick={() => {
                  setSearchQuery(term);
                  router.push(`/search?q=${encodeURIComponent(term)}`);
                }}
                className="text-sm text-white/70 hover:text-white bg-white/10 hover:bg-white/15 border border-white/15 px-3 py-1 rounded-full transition-all duration-150"
              >
                {term}
              </button>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {HERO_STATS.map((stat) => (
              <div key={`hero-stat-${stat.label}`} className="glass-card rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-white mb-0.5">{stat.value}</p>
                <p className="text-xs text-white/60">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-60">
        <span className="text-white/50 text-xs">Explore</span>
        <ChevronDown size={18} className="text-white/50 animate-bounce" />
      </div>
    </section>
  );
}