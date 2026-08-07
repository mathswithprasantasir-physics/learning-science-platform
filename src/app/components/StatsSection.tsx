import React from 'react';
import { TrendingUp, Users, BookOpen, Award } from 'lucide-react';

const STATS = [
  { icon: <BookOpen size={22} className="text-primary" />, value: '12,400+', label: 'Study Notes', desc: 'Across all boards & subjects' },
  { icon: <Users size={22} className="text-secondary" />, value: '1.2 Lakh+', label: 'Active Students', desc: 'Studying on LearningScience' },
  { icon: <TrendingUp size={22} className="text-success" />, value: '94.3%', label: 'Pass Rate', desc: 'Students who scored 80%+' },
  { icon: <Award size={22} className="text-warning" />, value: '500+', label: 'Topic Quizzes', desc: 'Chapter-wise practice tests' },
];

export default function StatsSection() {
  return (
    <section className="py-12 bg-card border-y border-border" aria-label="Platform statistics">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {STATS?.map((stat) => (
            <div key={`stat-${stat?.label}`} className="flex items-center gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary-light flex items-center justify-center">
                {stat?.icon}
              </div>
              <div>
                <p className="text-xl font-bold text-foreground tabular-nums">{stat?.value}</p>
                <p className="text-sm font-semibold text-foreground">{stat?.label}</p>
                <p className="text-xs text-muted-foreground">{stat?.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}