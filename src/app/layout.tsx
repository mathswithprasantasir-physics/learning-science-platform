import React from 'react';
import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
import '../styles/tailwind.css';
import { Toaster } from 'sonner';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-plus-jakarta',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'LearningScience — Master Your Board Exams',
  description:
    'Interactive notes, MCQs, quizzes, and previous year questions for WBBSE, WBCHSE, CBSE, ICSE and ISC students. Study smarter with LearningScience.',
  keywords: [
    'WBBSE notes',
    'WBCHSE MCQ',
    'CBSE previous year questions',
    'ICSE quiz',
    'board exam preparation',
    'class 10 science notes',
    'class 12 physics',
    'LearningScience',
  ],
  authors: [{ name: 'LearningScience Team' }],
  openGraph: {
    title: 'LearningScience — Master Your Board Exams',
    description:
      'Interactive notes, MCQs, quizzes, and PYQs for WBBSE, WBCHSE, CBSE, ICSE and ISC students.',
    type: 'website',
    locale: 'en_IN',
    siteName: 'LearningScience',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LearningScience — Master Your Board Exams',
    description:
      'Interactive notes, MCQs, quizzes, and PYQs for Indian board students.',
  },
  icons: {
    icon: [{ url: '/favicon.ico', type: 'image/x-icon' }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} ${jetbrainsMono.variable}`}>
      <body className={plusJakartaSans.className}>
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: 'var(--card)',
              color: 'var(--card-foreground)',
              border: '1px solid var(--border)',
              fontFamily: 'var(--font-sans)',
            },
          }}
        />
</body>
    </html>
  );
}