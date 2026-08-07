import React from 'react';
import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';
import { FileText, HelpCircle, ClipboardList, Archive, Mail, ExternalLink } from 'lucide-react';

const FOOTER_LINKS = {
  'Study Tools': [
    { label: 'Notes', href: '/notes', icon: <FileText size={14} /> },
    { label: 'MCQ Practice', href: '/mcq', icon: <HelpCircle size={14} /> },
    { label: 'Quizzes', href: '/quiz', icon: <ClipboardList size={14} /> },
    { label: 'Previous Year Questions', href: '/previous-year-questions', icon: <Archive size={14} /> },
  ],
  'Boards': [
    { label: 'WBBSE', href: '/notes?board=WBBSE', icon: null },
    { label: 'WBCHSE', href: '/notes?board=WBCHSE', icon: null },
    { label: 'CBSE', href: '/notes?board=CBSE', icon: null },
    { label: 'ICSE / ISC', href: '/notes?board=ICSE', icon: null },
  ],
  'Subjects': [
    { label: 'Mathematics', href: '/notes?subject=Mathematics', icon: null },
    { label: 'Physics', href: '/notes?subject=Physics', icon: null },
    { label: 'Chemistry', href: '/notes?subject=Chemistry', icon: null },
    { label: 'Biology', href: '/notes?subject=Biology', icon: null },
  ],
  'Company': [
    { label: 'About Us', href: '/about', icon: null },
    { label: 'Contact', href: '/contact', icon: null },
    { label: 'Privacy Policy', href: '/privacy', icon: null },
    { label: 'Terms of Service', href: '/terms', icon: null },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-20" role="contentinfo">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <AppLogo size={36} />
              <span className="font-bold text-lg">
                <span className="text-gradient">Learning</span>
                <span className="text-foreground">Science</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              Interactive study platform for WBBSE, WBCHSE, CBSE, ICSE and ISC students.
              Master your board exams with notes, MCQs, quizzes, and previous year questions.
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail size={14} />
              <a
                href="mailto:hello@learningscience.in"
                className="hover:text-primary transition-colors"
              >
                hello@learningscience.in
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(FOOTER_LINKS)?.map(([section, links]) => (
            <div key={`footer-section-${section}`}>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
                {section}
              </h3>
              <ul className="space-y-2.5">
                {links?.map((link) => (
                  <li key={`footer-link-${link?.href}`}>
                    <Link
                      href={link?.href}
                      className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors duration-150"
                    >
                      {link?.icon}
                      {link?.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © 2026 LearningScience. All rights reserved. Made with ❤️ for Indian students.
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
            <Link href="/sitemap.xml" className="hover:text-foreground transition-colors flex items-center gap-1">
              Sitemap <ExternalLink size={10} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}