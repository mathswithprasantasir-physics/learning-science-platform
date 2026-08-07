'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AppLogo from '@/components/ui/AppLogo';
import { useTheme } from '@/components/ThemeProvider';
import { Sun, Moon, Search, Menu, X, BookOpen, HelpCircle, FileText, ClipboardList, Archive,  } from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '/', icon: <BookOpen size={16} /> },
  { label: 'Notes', href: '/notes', icon: <FileText size={16} /> },
  { label: 'MCQ', href: '/mcq', icon: <HelpCircle size={16} />, badge: 'New' },
  { label: 'Quiz', href: '/quiz', icon: <ClipboardList size={16} /> },
  { label: 'PYQ', href: '/previous-year-questions', icon: <Archive size={16} /> },
  { label: 'Search', href: '/search', icon: <Search size={16} /> },
];

export default function Header() {
  const pathname = usePathname();
  const { resolvedTheme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-card/95 backdrop-blur-md border-b border-border shadow-sm'
            : 'bg-transparent'
        }`}
        role="banner"
      >
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group" aria-label="LearningScience Home">
              <AppLogo size={36} />
              <span className="font-bold text-lg tracking-tight hidden sm:block">
                <span className="text-gradient">Learning</span>
                <span className="text-foreground">Science</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={`nav-${item.href}`}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-150 relative ${
                    isActive(item.href)
                      ? 'bg-primary-light text-primary' :'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                >
                  {item.icon}
                  {item.label}
                  {item.badge && (
                    <span className="ml-1 text-[10px] font-semibold bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full leading-none">
                      {item.badge}
                    </span>
                  )}
                </Link>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              <Link
                href="/search"
                className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-muted text-muted-foreground text-sm hover:border-primary/40 hover:text-foreground transition-all duration-150"
                aria-label="Search"
              >
                <Search size={14} />
                <span className="hidden xl:block">Search...</span>
                <kbd className="hidden xl:block text-[10px] bg-card border border-border rounded px-1 py-0.5 font-mono">⌘K</kbd>
              </Link>

              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all duration-150"
                aria-label={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
              >
                {resolvedTheme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
              </button>

              <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden p-2 rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground transition-all duration-150"
                aria-label="Open menu"
                aria-expanded={mobileOpen}
              >
                <Menu size={18} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      <div
        className={`fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile Drawer */}
      <div
        ref={drawerRef}
        className={`fixed top-0 right-0 bottom-0 z-[70] w-72 bg-card border-l border-border shadow-xl transition-transform duration-300 ease-in-out lg:hidden ${
          mobileOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <AppLogo size={32} />
            <span className="font-bold text-base">
              <span className="text-gradient">Learning</span>
              <span className="text-foreground">Science</span>
            </span>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="p-4 space-y-1" aria-label="Mobile navigation">
          {NAV_ITEMS.map((item) => (
            <Link
              key={`mobile-nav-${item.href}`}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                isActive(item.href)
                  ? 'bg-primary-light text-primary' :'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
              aria-current={isActive(item.href) ? 'page' : undefined}
            >
              <span className="w-5 flex-shrink-0">{item.icon}</span>
              {item.label}
              {item.badge && (
                <span className="ml-auto text-[10px] font-semibold bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
          <button
            onClick={toggleTheme}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
          >
            {resolvedTheme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            {resolvedTheme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
      </div>
    </>
  );
}