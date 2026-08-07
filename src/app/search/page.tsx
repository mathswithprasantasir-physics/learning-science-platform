import React, { Suspense } from 'react';
import AppLayout from '@/components/AppLayout';
import SearchPageClient from './components/SearchPageClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Search — LearningScience',
  description: 'Search across notes, MCQs, quizzes, previous year questions, and formulas on LearningScience.',
};

export default function SearchPage() {
  return (
    <AppLayout>
      <Suspense fallback={<div className="flex items-center justify-center min-h-[400px]"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>}>
        <SearchPageClient />
      </Suspense>
    </AppLayout>
  );
}