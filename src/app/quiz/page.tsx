import React from 'react';
import AppLayout from '@/components/AppLayout';
import QuizPageClient from './components/QuizPageClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Quizzes — LearningScience',
  description: 'Timed chapter-wise quizzes for WBBSE, WBCHSE, CBSE, ICSE and ISC. Practice with instant scoring and detailed feedback.',
};

export default function QuizPage() {
  return (
    <AppLayout>
      <QuizPageClient />
    </AppLayout>
  );
}