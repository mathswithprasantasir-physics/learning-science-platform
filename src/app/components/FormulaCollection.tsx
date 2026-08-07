import React from 'react';
import Link from 'next/link';
import { MOCK_FORMULAS } from '@/data/mockData';
import FormulaCard from '@/components/ui/FormulaCard';
import { ArrowRight, Sigma } from 'lucide-react';

export default function FormulaCollection() {
  return (
    <section className="section-padding bg-muted/30" aria-labelledby="formula-collection-heading">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sigma size={14} className="text-primary" />
              <p className="text-xs font-semibold uppercase tracking-widest text-primary">Quick Reference</p>
            </div>
            <h2 id="formula-collection-heading" className="text-3xl font-bold text-foreground">Formula Sheets</h2>
            <p className="text-muted-foreground mt-2">Key formulas with variables explained. Copy with one click.</p>
          </div>
          <Link href="/notes?type=formula" className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
            All formulas <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-6 gap-4">
          {MOCK_FORMULAS?.map((formula) => (
            <FormulaCard key={`home-formula-${formula?.id}`} formula={formula} />
          ))}
        </div>
      </div>
    </section>
  );
}