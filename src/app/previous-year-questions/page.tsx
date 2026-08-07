import React from 'react';
import AppLayout from '@/components/AppLayout';
import PYQPageClient from './components/PYQPageClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Previous Year Questions — LearningScience',
  description: 'Browse and practice previous year board exam questions for WBBSE, WBCHSE, CBSE, ICSE and ISC from 2018 to 2024.',
};

export default function PYQPage() {
  return (
    <AppLayout>
      <PYQPageClient />
    </AppLayout>
  );
}