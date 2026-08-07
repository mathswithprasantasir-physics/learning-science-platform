'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BOARDS, BOARD_COLORS } from '@/constants';
import type { Board } from '@/types';
import { ArrowRight } from 'lucide-react';

const BOARD_DESCRIPTIONS: Record<Board, string> = {
  WBBSE: 'Classes 6–10 · West Bengal curriculum',
  WBCHSE: 'Classes 11–12 · Higher Secondary',
  CBSE: 'Classes 6–12 · National curriculum',
  ICSE: 'Classes 6–10 · Council for Indian School',
  ISC: 'Classes 11–12 · Indian School Certificate',
};

const BOARD_COUNTS: Record<Board, { notes: number; mcqs: number }> = {
  WBBSE: { notes: 2840, mcqs: 9200 },
  WBCHSE: { notes: 1920, mcqs: 7400 },
  CBSE: { notes: 4210, mcqs: 15600 },
  ICSE: { notes: 1880, mcqs: 6800 },
  ISC: { notes: 1550, mcqs: 5900 },
};

export default function BoardSelector() {
  const router = useRouter();

  return (
    <section className="section-padding" aria-labelledby="board-selector-heading">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">Select Your Board</p>
            <h2 id="board-selector-heading" className="text-3xl font-bold text-foreground">
              Study by Your Curriculum
            </h2>
            <p className="text-muted-foreground mt-2">Choose your board to access tailored notes, MCQs, and quizzes.</p>
          </div>
          <Link href="/notes" className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
            Browse all <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {BOARDS.map((board) => {
            const color = BOARD_COLORS[board.value];
            const counts = BOARD_COUNTS[board.value];
            return (
              <button
                key={`board-card-${board.value}`}
                onClick={() => router.push(`/notes?board=${board.value}`)}
                className="group text-left bg-card border border-border rounded-xl p-5 card-shadow card-shadow-hover focus:outline-none focus:ring-2 focus:ring-ring"
                aria-label={`Study ${board.label} curriculum`}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm mb-4 transition-transform duration-200 group-hover:scale-110"
                  style={{ backgroundColor: color }}
                >
                  {board.value}
                </div>
                <h3 className="text-sm font-bold text-foreground mb-1">{board.label}</h3>
                <p className="text-[11px] text-muted-foreground mb-3">{BOARD_DESCRIPTIONS[board.value]}</p>
                <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                  <span>{counts.notes.toLocaleString('en-IN')} notes</span>
                  <span>·</span>
                  <span>{counts.mcqs.toLocaleString('en-IN')} MCQs</span>
                </div>
                <div
                  className="mt-3 flex items-center gap-1 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                  style={{ color }}
                >
                  Explore <ArrowRight size={12} />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}