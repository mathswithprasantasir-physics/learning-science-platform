import React from 'react';
import { Search, FileText, HelpCircle, ClipboardList, Archive, Inbox } from 'lucide-react';

type EmptyStateType = 'notes' | 'mcq' | 'quiz' | 'pyq' | 'search' | 'generic';

interface EmptyStateProps {
  type?: EmptyStateType;
  title?: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const EMPTY_CONFIGS: Record<EmptyStateType, { icon: React.ReactNode; title: string; description: string }> = {
  notes: {
    icon: <FileText size={40} className="text-muted-foreground/50" />,
    title: 'No notes found',
    description: 'No notes match your current filters. Try adjusting your board, subject, or class selection.',
  },
  mcq: {
    icon: <HelpCircle size={40} className="text-muted-foreground/50" />,
    title: 'No MCQs found',
    description: 'No MCQs match your current filters. Try a different subject or chapter.',
  },
  quiz: {
    icon: <ClipboardList size={40} className="text-muted-foreground/50" />,
    title: 'No quizzes available',
    description: 'No quizzes match your selection. Check back soon for new quizzes.',
  },
  pyq: {
    icon: <Archive size={40} className="text-muted-foreground/50" />,
    title: 'No previous year questions',
    description: 'No PYQs found for your selected filters. Try a different year, board, or subject.',
  },
  search: {
    icon: <Search size={40} className="text-muted-foreground/50" />,
    title: 'No results found',
    description: 'Your search returned no results. Try different keywords or adjust your filters.',
  },
  generic: {
    icon: <Inbox size={40} className="text-muted-foreground/50" />,
    title: 'Nothing here yet',
    description: 'This section is empty. Check back later.',
  },
};

export default function EmptyState({ type = 'generic', title, description, action }: EmptyStateProps) {
  const config = EMPTY_CONFIGS[type];

  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="mb-4">{config.icon}</div>
      <h3 className="text-base font-semibold text-foreground mb-2">{title ?? config.title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-6">{description ?? config.description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all duration-150 active:scale-95"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}