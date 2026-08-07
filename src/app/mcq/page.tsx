import React from 'react';
import AppLayout from '@/components/AppLayout';
import MCQPageClient from './components/MCQPageClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'MCQ Practice — LearningScience',
  description: 'Practice multiple choice questions with instant feedback and detailed explanations for WBBSE, WBCHSE, CBSE, ICSE and ISC.',
};

export default function MCQPage() {
  return (
    <AppLayout>
      <MCQPageClient />
    </AppLayout>
  );
}