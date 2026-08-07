import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ThemeProvider } from '@/components/ThemeProvider';

interface AppLayoutProps {
  children: React.ReactNode;
  showFooter?: boolean;
  className?: string;
}

export default function AppLayout({ children, showFooter = true, className = '' }: AppLayoutProps) {
  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <Header />
        <main
          id="main-content"
          className={`flex-1 pt-16 ${className}`}
          role="main"
        >
          {children}
        </main>
        {showFooter && <Footer />}
      </div>
    </ThemeProvider>
  );
}