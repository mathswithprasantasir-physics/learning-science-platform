import React from 'react';
import Link from 'next/link';
import { FileText, HelpCircle, ClipboardList, Archive, Search, Sigma } from 'lucide-react';

const TOOLS = [
  {
    id: 'tool-notes',
    icon: <FileText size={24} />,
    title: 'Study Notes',
    description: 'Chapter-wise notes with diagrams, key points, and solved examples.',
    href: '/notes',
    color: 'text-primary',
    bg: 'bg-primary-light',
    count: '12,400+ notes',
  },
  {
    id: 'tool-mcq',
    icon: <HelpCircle size={24} />,
    title: 'MCQ Practice',
    description: 'Multiple choice questions with instant feedback and explanations.',
    href: '/mcq',
    color: 'text-accent',
    bg: 'bg-accent/10',
    count: '45,000+ questions',
  },
  {
    id: 'tool-quiz',
    icon: <ClipboardList size={24} />,
    title: 'Timed Quizzes',
    description: 'Chapter-wise quizzes with timer, scoring, and performance review.',
    href: '/quiz',
    color: 'text-secondary',
    bg: 'bg-secondary/10',
    count: '500+ quizzes',
  },
  {
    id: 'tool-pyq',
    icon: <Archive size={24} />,
    title: 'Previous Year Qs',
    description: 'Actual board exam questions from 2018–2024 with model answers.',
    href: '/previous-year-questions',
    color: 'text-warning',
    bg: 'bg-warning-light',
    count: '8,200+ questions',
  },
  {
    id: 'tool-search',
    icon: <Search size={24} />,
    title: 'Smart Search',
    description: 'Search across notes, MCQs, formulas, and PYQs in one place.',
    href: '/search',
    color: 'text-success',
    bg: 'bg-success-light',
    count: 'Instant results',
  },
  {
    id: 'tool-formula',
    icon: <Sigma size={24} />,
    title: 'Formula Sheets',
    description: 'Quick-reference formula cards for Physics, Chemistry and Maths.',
    href: '/notes?type=formula',
    color: 'text-info',
    bg: 'bg-info-light',
    count: '2,100+ formulas',
  },
];

export default function StudyToolsGrid() {
  return (
    <section className="section-padding" aria-labelledby="study-tools-heading">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">Everything You Need</p>
          <h2 id="study-tools-heading" className="text-3xl font-bold text-foreground mb-3">Study Tools</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            A complete toolkit for board exam preparation — from first reading to final revision.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-6 gap-5">
          {TOOLS?.map((tool) => (
            <Link
              key={tool?.id}
              href={tool?.href}
              className="group bg-card border border-border rounded-xl p-5 card-shadow card-shadow-hover focus:outline-none focus:ring-2 focus:ring-ring"
              aria-label={tool?.title}
            >
              <div className={`w-12 h-12 rounded-xl ${tool?.bg} flex items-center justify-center mb-4 transition-transform duration-200 group-hover:scale-110 ${tool?.color}`}>
                {tool?.icon}
              </div>
              <h3 className="text-sm font-semibold text-foreground mb-1.5 group-hover:text-primary transition-colors">{tool?.title}</h3>
              <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{tool?.description}</p>
              <span className={`text-[11px] font-semibold ${tool?.color}`}>{tool?.count}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}