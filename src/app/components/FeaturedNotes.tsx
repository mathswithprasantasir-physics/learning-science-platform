import React from 'react';
import Link from 'next/link';
import { MOCK_NOTES } from '@/data/mockData';
import NoteCard from '@/components/ui/NoteCard';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function FeaturedNotes() {
  const featured = MOCK_NOTES?.filter(n => n?.isFeatured)?.slice(0, 6);

  return (
    <section className="section-padding bg-muted/30" aria-labelledby="featured-notes-heading">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={14} className="text-primary" />
              <p className="text-xs font-semibold uppercase tracking-widest text-primary">Editor's Picks</p>
            </div>
            <h2 id="featured-notes-heading" className="text-3xl font-bold text-foreground">Featured Notes</h2>
            <p className="text-muted-foreground mt-2">Handpicked, exam-ready notes across all subjects.</p>
          </div>
          <Link href="/notes" className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
            All notes <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 gap-5">
          {featured?.map((note) => (
            <NoteCard key={`featured-note-${note?.id}`} note={note} variant="featured" />
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/notes"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-all"
          >
            Browse All Notes <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}