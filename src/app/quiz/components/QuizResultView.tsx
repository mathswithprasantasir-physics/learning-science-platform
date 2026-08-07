'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import type { MCQ } from '@/types';

import { CheckCircle2, XCircle, RotateCcw, ArrowLeft, Target, Clock, AlertCircle } from 'lucide-react';

const RadialBarChart = dynamic(() => import('recharts').then(m => ({ default: m.RadialBarChart })), { ssr: false });
const RadialBar = dynamic(() => import('recharts').then(m => ({ default: m.RadialBar })), { ssr: false });
const ResponsiveContainer = dynamic(() => import('recharts').then(m => ({ default: m.ResponsiveContainer })), { ssr: false });

interface QuizSession {
  quiz: { id: string; title: string; subject: any; board: any; classLevel: number; durationMinutes: number; questions: MCQ[]; difficulty: any };
  answers: Record<string, string>;
  startedAt: number;
  finishedAt?: number;
  timeRemaining: number;
}

interface QuizResultViewProps {
  session: QuizSession;
  onRetry: () => void;
  onBack: () => void;
}

export default function QuizResultView({ session, onRetry, onBack }: QuizResultViewProps) {
  const [reviewOpen, setReviewOpen] = useState(false);
  const [expandedQ, setExpandedQ] = useState<string | null>(null);

  const questions = session.quiz.questions;
  const totalQ = questions.length;
  const correct = questions.filter(q => {
    const correctOpt = q.options.find(o => o.isCorrect);
    return correctOpt && session.answers[q.id] === correctOpt.id;
  }).length;
  const wrong = questions.filter(q => {
    const ans = session.answers[q.id];
    if (!ans) return false;
    const selectedOpt = q.options.find(o => o.id === ans);
    return selectedOpt && !selectedOpt.isCorrect;
  }).length;
  const unanswered = totalQ - Object.keys(session.answers).length;
  const score = totalQ > 0 ? Math.round((correct / totalQ) * 100) : 0;
  const timeTaken = session.finishedAt ? Math.floor((session.finishedAt - session.startedAt) / 1000) : 0;
  const formatTime = (s: number) => `${Math.floor(s / 60)}m ${s % 60}s`;

  const getGrade = () => {
    if (score >= 90) return { label: 'Outstanding!', color: 'text-success', emoji: '🏆' };
    if (score >= 75) return { label: 'Great Job!', color: 'text-primary', emoji: '🎉' };
    if (score >= 60) return { label: 'Good Effort', color: 'text-info', emoji: '👍' };
    if (score >= 40) return { label: 'Keep Practicing', color: 'text-warning', emoji: '📚' };
    return { label: 'Needs Revision', color: 'text-danger', emoji: '💪' };
  };

  const grade = getGrade();
  const chartData = [{ name: 'Score', value: score, fill: score >= 75 ? 'var(--success)' : score >= 50 ? 'var(--warning)' : 'var(--danger)' }];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      {/* Result Header */}
      <div className="text-center mb-10">
        <div className="text-5xl mb-3">{grade.emoji}</div>
        <h1 className={`text-3xl font-extrabold mb-1 ${grade.color}`}>{grade.label}</h1>
        <p className="text-muted-foreground">{session.quiz.title}</p>
      </div>

      {/* Score Card */}
      <div className="bg-card border border-border rounded-2xl p-6 card-shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Radial Chart */}
          <div className="flex flex-col items-center">
            <div className="relative w-48 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart
                  cx="50%"
                  cy="50%"
                  innerRadius="70%"
                  outerRadius="90%"
                  data={chartData}
                  startAngle={90}
                  endAngle={90 - (score / 100) * 360}
                >
                  <RadialBar dataKey="value" cornerRadius={8} background={{ fill: 'var(--muted)' }} />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-extrabold text-foreground tabular-nums">{score}%</span>
                <span className="text-xs text-muted-foreground">Score</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-success-light rounded-xl p-3 text-center">
                <p className="text-2xl font-bold text-success tabular-nums">{correct}</p>
                <p className="text-xs text-success/80">Correct</p>
              </div>
              <div className="bg-danger-light rounded-xl p-3 text-center">
                <p className="text-2xl font-bold text-danger tabular-nums">{wrong}</p>
                <p className="text-xs text-danger/80">Wrong</p>
              </div>
              <div className="bg-muted rounded-xl p-3 text-center">
                <p className="text-2xl font-bold text-muted-foreground tabular-nums">{unanswered}</p>
                <p className="text-xs text-muted-foreground">Skipped</p>
              </div>
              <div className="bg-info-light rounded-xl p-3 text-center">
                <p className="text-2xl font-bold text-info tabular-nums">{totalQ}</p>
                <p className="text-xs text-info/80">Total Qs</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock size={14} />
              Time taken: <strong className="text-foreground">{formatTime(timeTaken)}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <button
          onClick={onBack}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:text-foreground transition-all"
        >
          <ArrowLeft size={15} /> Back to Quizzes
        </button>
        <button
          onClick={() => setReviewOpen(p => !p)}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-primary text-primary text-sm font-semibold hover:bg-primary-light transition-all"
        >
          <Target size={15} /> {reviewOpen ? 'Hide' : 'Review'} Answers
        </button>
        <button
          onClick={onRetry}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-all active:scale-95"
        >
          <RotateCcw size={15} /> Try Again
        </button>
      </div>

      {/* Answer Review */}
      {reviewOpen && (
        <div className="space-y-4 animate-fade-in">
          <h2 className="text-base font-semibold text-foreground">Answer Review</h2>
          {questions.map((q, idx) => {
            const userAnswerId = session.answers[q.id];
            const correctOpt = q.options.find(o => o.isCorrect);
            const userOpt = q.options.find(o => o.id === userAnswerId);
            const isCorrect = correctOpt && userAnswerId === correctOpt.id;
            const isExpanded = expandedQ === q.id;

            return (
              <div
                key={`review-q-${q.id}`}
                className={`bg-card border rounded-xl overflow-hidden transition-all ${
                  isCorrect ? 'border-success/40' : userAnswerId ? 'border-danger/40' : 'border-border'
                }`}
              >
                <button
                  onClick={() => setExpandedQ(isExpanded ? null : q.id)}
                  className="w-full flex items-start gap-3 p-4 text-left"
                  aria-expanded={isExpanded}
                >
                  <span className="flex-shrink-0 mt-0.5">
                    {isCorrect
                      ? <CheckCircle2 size={16} className="text-success" />
                      : userAnswerId
                        ? <XCircle size={16} className="text-danger" />
                        : <AlertCircle size={16} className="text-muted-foreground" />
                    }
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground line-clamp-2">
                      Q{idx + 1}. {q.question}
                    </p>
                    {!isExpanded && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {isCorrect ? 'Correct' : userAnswerId ? `Your answer: ${userOpt?.text ?? '—'}` : 'Not answered'}
                      </p>
                    )}
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-4 pb-4 space-y-2 border-t border-border pt-3 animate-fade-in">
                    {q.options.map(opt => (
                      <div
                        key={`review-opt-${opt.id}`}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs ${
                          opt.isCorrect
                            ? 'bg-success-light text-success font-semibold'
                            : userAnswerId === opt.id && !opt.isCorrect
                              ? 'bg-danger-light text-danger' :'bg-muted text-muted-foreground'
                        }`}
                      >
                        {opt.isCorrect && <CheckCircle2 size={12} />}
                        {userAnswerId === opt.id && !opt.isCorrect && <XCircle size={12} />}
                        {opt.text}
                        {opt.isCorrect && <span className="ml-auto font-medium">✓ Correct</span>}
                        {userAnswerId === opt.id && !opt.isCorrect && <span className="ml-auto">Your answer</span>}
                      </div>
                    ))}
                    <div className="mt-3 p-3 bg-info-light rounded-lg border border-info/20">
                      <p className="text-xs text-foreground leading-relaxed">
                        <strong className="text-info">Explanation: </strong>{q.explanation}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}