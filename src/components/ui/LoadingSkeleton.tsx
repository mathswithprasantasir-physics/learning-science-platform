import React from 'react';

export function SkeletonBlock({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse bg-muted rounded-lg ${className}`} />;
}

export function NoteCardSkeleton() {
  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="flex gap-2 mb-2">
        <SkeletonBlock className="h-5 w-14" />
        <SkeletonBlock className="h-5 w-10" />
      </div>
      <SkeletonBlock className="h-4 w-full mb-1.5" />
      <SkeletonBlock className="h-4 w-3/4 mb-3" />
      <SkeletonBlock className="h-5 w-20 mb-3" />
      <div className="flex gap-3 pt-3 border-t border-border">
        <SkeletonBlock className="h-3 w-16" />
        <SkeletonBlock className="h-3 w-16" />
      </div>
    </div>
  );
}

export function QuizCardSkeleton() {
  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="flex gap-2 mb-3">
        <SkeletonBlock className="h-5 w-14" />
        <SkeletonBlock className="h-5 w-10" />
      </div>
      <SkeletonBlock className="h-4 w-full mb-1.5" />
      <SkeletonBlock className="h-4 w-2/3 mb-3" />
      <SkeletonBlock className="h-5 w-20 mb-4" />
      <div className="grid grid-cols-3 gap-2 pt-4 border-t border-border">
        <SkeletonBlock className="h-10" />
        <SkeletonBlock className="h-10" />
        <SkeletonBlock className="h-10" />
      </div>
    </div>
  );
}

export function MCQSkeleton() {
  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <SkeletonBlock className="h-5 w-full mb-2" />
      <SkeletonBlock className="h-5 w-3/4 mb-6" />
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <SkeletonBlock key={`mcq-opt-skeleton-${i}`} className="h-12 w-full" />
        ))}
      </div>
    </div>
  );
}

export function PYQSkeleton() {
  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="flex gap-2 mb-3">
        <SkeletonBlock className="h-5 w-12" />
        <SkeletonBlock className="h-5 w-16" />
        <SkeletonBlock className="h-5 w-10" />
      </div>
      <SkeletonBlock className="h-4 w-full mb-1.5" />
      <SkeletonBlock className="h-4 w-4/5 mb-3" />
      <div className="flex gap-2">
        <SkeletonBlock className="h-3 w-16" />
        <SkeletonBlock className="h-3 w-12" />
      </div>
    </div>
  );
}