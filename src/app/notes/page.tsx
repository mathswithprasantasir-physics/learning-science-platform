import React from 'react';
import AppLayout from '@/components/AppLayout';
import NotesPageClient from './components/NotesPageClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Study Notes — LearningScience',
  description: 'Chapter-wise study notes for WBBSE, WBCHSE, CBSE, ICSE and ISC. Browse by board, subject, class and chapter.',
};

export default function NotesPage() {
  return (
    <AppLayout>
      <NotesPageClient />
    </AppLayout>
  );
}