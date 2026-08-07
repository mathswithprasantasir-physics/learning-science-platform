'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MOCK_MCQS } from '@/data/mockData';
import SubjectBadge from '@/components/ui/SubjectBadge';
import DifficultyBadge from '@/components/ui/DifficultyBadge';
import { ArrowRight, CheckCircle2, XCircle } from 'lucide-react';
import type { Subject } from '@/types';
import { SUBJECTS } from '@/constants';

export default function PopularMCQs() {
  const [selectedSubject, setSelectedSubject] = useState<Subject | 'All'>('All');
  const [answered, setAnswered] = useState<Record<string, string>>({});

  const filtered = selectedSubject === 'All'
    ? MOCK_MCQS.slice(0, 4)
    : MOCK_MCQS.filter(q => q.subject === selectedSubject).slice(0, 4);

  const handleAnswer = (mcqId: string, optionId: string) => {
    if (answered[mcqId]) return;
    setAnswered(prev => ({ ...prev, [mcqId]: optionId }));
  };

  return (
    <section className="section-padding" aria-labelledby="popular-mcqs-heading">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">Practice Now</p>
            <h2 id="popular-mcqs-heading" className="text-3xl font-bold text-foreground">Popular MCQs</h2>
            <p className="text-muted-foreground mt-2">Try these questions and check your answers instantly.</p>
          </div>
          <Link href="/mcq" className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
            All MCQs <ArrowRight size={14} />
          </Link>
        </div>

        {/* Subject Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setSelectedSubject('All')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 ${
              selectedSubject === 'All' ?'bg-primary text-primary-foreground' :'bg-muted text-muted-foreground hover:text-foreground'
            }`}
          >
            All Subjects
          </button>
          {SUBJECTS.map(s => (
            <button
              key={`mcq-filter-${s.value}`}
              onClick={() => setSelectedSubject(s.value)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 ${
                selectedSubject === s.value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {filtered.map((mcq) => {
            const userAnswer = answered[mcq.id];
            const isAnswered = Boolean(userAnswer);

            return (
              <div key={`home-mcq-${mcq.id}`} className="bg-card border border-border rounded-xl p-5 card-shadow">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex flex-wrap gap-1.5">
                    <SubjectBadge subject={mcq.subject} size="sm" />
                    <DifficultyBadge difficulty={mcq.difficulty} size="sm" />
                  </div>
                  <span className="text-[11px] text-muted-foreground whitespace-nowrap">{mcq.marks} mark</span>
                </div>

                <p className="text-sm font-medium text-foreground mb-4 leading-relaxed">{mcq.question}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {mcq.options.map((option) => {
                    let optClass = 'bg-muted border-border text-foreground hover:border-primary/50 hover:bg-primary-light cursor-pointer';
                    if (isAnswered) {
                      if (option.isCorrect) {
                        optClass = 'quiz-option-correct border cursor-default';
                      } else if (userAnswer === option.id && !option.isCorrect) {
                        optClass = 'quiz-option-wrong border cursor-default';
                      } else {
                        optClass = 'bg-muted border-border text-muted-foreground cursor-default opacity-60';
                      }
                    }

                    return (
                      <button
                        key={`home-opt-${option.id}`}
                        onClick={() => handleAnswer(mcq.id, option.id)}
                        disabled={isAnswered}
                        className={`text-left text-xs px-3 py-2.5 rounded-lg border transition-all duration-150 flex items-center gap-2 ${optClass}`}
                      >
                        {isAnswered && option.isCorrect && <CheckCircle2 size={13} className="flex-shrink-0" />}
                        {isAnswered && userAnswer === option.id && !option.isCorrect && <XCircle size={13} className="flex-shrink-0" />}
                        {option.text}
                      </button>
                    );
                  })}
                </div>

                {isAnswered && (
                  <div className="mt-3 p-3 bg-info-light rounded-lg border border-info/20 animate-fade-in">
                    <p className="text-xs text-foreground leading-relaxed">
                      <span className="font-semibold text-info">Explanation: </span>
                      {mcq.explanation}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/mcq"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-all active:scale-95"
          >
            Practice More MCQs <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}