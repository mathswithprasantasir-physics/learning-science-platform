import React from 'react';
import Link from 'next/link';
import { MOCK_PYQS } from '@/data/mockData';
import SubjectBadge from '@/components/ui/SubjectBadge';
import BoardBadge from '@/components/ui/BoardBadge';
import DifficultyBadge from '@/components/ui/DifficultyBadge';
import { ArrowRight, Calendar } from 'lucide-react';

export default function PYQSection() {
  const pyqs = MOCK_PYQS?.slice(0, 5);

  return (
    <section className="section-padding" aria-labelledby="pyq-section-heading">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left: Intro */}
          <div className="lg:col-span-1">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">Exam Prep</p>
            <h2 id="pyq-section-heading" className="text-3xl font-bold text-foreground mb-4">
              Previous Year Questions
            </h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Practice with actual board exam questions from 2018–2024. Understand the pattern, marks distribution, and expected answers.
            </p>

            <div className="space-y-3 mb-8">
              {[
                { label: '2024 Board Papers', count: '1,240 Qs' },
                { label: '2023 Board Papers', count: '1,180 Qs' },
                { label: '2022 Board Papers', count: '1,090 Qs' },
                { label: '2021 Board Papers', count: '980 Qs' },
              ]?.map((item) => (
                <div key={`year-stat-${item?.label}`} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-primary" />
                    <span className="text-sm font-medium text-foreground">{item?.label}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{item?.count}</span>
                </div>
              ))}
            </div>

            <Link
              href="/previous-year-questions"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-all active:scale-95"
            >
              Browse All PYQs <ArrowRight size={14} />
            </Link>
          </div>

          {/* Right: PYQ List */}
          <div className="lg:col-span-2 space-y-3">
            {pyqs?.map((pyq) => (
              <Link
                key={`home-pyq-${pyq?.id}`}
                href={`/previous-year-questions?id=${pyq?.id}`}
                className="group block bg-card border border-border rounded-xl p-4 card-shadow hover:border-primary/30 transition-all duration-150"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex flex-wrap gap-1.5">
                    <BoardBadge board={pyq?.board} size="sm" />
                    <SubjectBadge subject={pyq?.subject} size="sm" />
                    <span className="inline-flex items-center gap-1 text-[10px] font-medium bg-muted text-muted-foreground px-1.5 py-0.5 rounded-full">
                      <Calendar size={9} /> {pyq?.year}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <DifficultyBadge difficulty={pyq?.difficulty} size="sm" />
                    <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">{pyq?.marks}m</span>
                  </div>
                </div>
                <p className="text-sm text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-relaxed">
                  {pyq?.question}
                </p>
                <p className="text-[11px] text-muted-foreground mt-1.5">{pyq?.chapter}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}