'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MOCK_QUIZZES } from '@/data/mockData';
import QuizCard from '@/components/ui/QuizCard';
import { ArrowRight } from 'lucide-react';

export default function LatestQuizzes() {
  const router = useRouter();
  const quizzes = MOCK_QUIZZES?.slice(0, 4);

  return (
    <section className="section-padding bg-muted/30" aria-labelledby="latest-quizzes-heading">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">Test Yourself</p>
            <h2 id="latest-quizzes-heading" className="text-3xl font-bold text-foreground">Latest Quizzes</h2>
            <p className="text-muted-foreground mt-2">Timed chapter-wise quizzes with instant scoring.</p>
          </div>
          <Link href="/quiz" className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
            All quizzes <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 gap-5">
          {quizzes?.map((quiz) => (
            <QuizCard
              key={`home-quiz-${quiz?.id}`}
              quiz={quiz}
              onStart={(id) => router?.push(`/quiz?start=${id}`)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}