import React from 'react';
import AppLayout from '@/components/AppLayout';
import HeroSection from './components/HeroSection';
import BoardSelector from './components/BoardSelector';
import FeaturedNotes from './components/FeaturedNotes';
import PopularMCQs from './components/PopularMCQs';
import LatestQuizzes from './components/LatestQuizzes';
import PYQSection from './components/PYQSection';
import FormulaCollection from './components/FormulaCollection';
import StudyToolsGrid from './components/StudyToolsGrid';
import NewsletterSection from './components/NewsletterSection';
import StatsSection from './components/StatsSection';

export default function HomePage() {
  return (
    <AppLayout>
      <HeroSection />
      <StatsSection />
      <BoardSelector />
      <FeaturedNotes />
      <PopularMCQs />
      <LatestQuizzes />
      <PYQSection />
      <FormulaCollection />
      <StudyToolsGrid />
      <NewsletterSection />
    </AppLayout>
  );
}