'use client';

import React from 'react';
import type { Formula } from '@/types';
import SubjectBadge from './SubjectBadge';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface FormulaCardProps {
  formula: Formula;
}

export default function FormulaCard({ formula }: FormulaCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(formula.expression).then(() => {
      setCopied(true);
      toast.success('Formula copied!');
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="bg-card border border-border rounded-xl p-4 card-shadow group">
      <div className="flex items-start justify-between mb-3">
        <SubjectBadge subject={formula.subject} size="sm" />
        <button
          onClick={handleCopy}
          className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-150 opacity-0 group-hover:opacity-100"
          aria-label="Copy formula"
        >
          {copied ? <Check size={13} className="text-success" /> : <Copy size={13} />}
        </button>
      </div>
      <h4 className="text-sm font-semibold text-foreground mb-2">{formula.title}</h4>
      <div className="bg-muted rounded-lg px-3 py-2 mb-2">
        <code className="text-sm font-mono font-medium text-primary">{formula.expression}</code>
      </div>
      <p className="text-xs text-muted-foreground">{formula.description}</p>
      {formula.variables && (
        <div className="mt-2 pt-2 border-t border-border">
          {Object.entries(formula.variables).map(([key, val]) => (
            <p key={`var-${formula.id}-${key}`} className="text-[11px] text-muted-foreground">
              <code className="font-mono text-primary mr-1">{key}</code> = {val}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}