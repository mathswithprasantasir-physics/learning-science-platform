'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Mail, Loader2, CheckCircle2, Bell } from 'lucide-react';

interface NewsletterForm {
  email: string;
  board: string;
}

export default function NewsletterSection() {
  const [submitted, setSubmitted] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<NewsletterForm>();

  const onSubmit = async (data: NewsletterForm) => {
    // Backend integration point: POST /api/newsletter/subscribe
    await new Promise(r => setTimeout(r, 1200));
    setSubmitted(true);
    toast.success('Subscribed! You\'ll get weekly study updates.');
  };

  return (
    <section className="section-padding bg-card border-t border-border" aria-labelledby="newsletter-heading">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-14 h-14 rounded-2xl bg-primary-light flex items-center justify-center mx-auto mb-6">
            <Bell size={24} className="text-primary" />
          </div>
          <h2 id="newsletter-heading" className="text-3xl font-bold text-foreground mb-3">
            Weekly Study Updates
          </h2>
          <p className="text-muted-foreground mb-8">
            Get new notes, MCQs, and exam tips delivered to your inbox every week.
            No spam — only useful study material.
          </p>

          {submitted ? (
            <div className="flex flex-col items-center gap-3 py-8">
              <CheckCircle2 size={48} className="text-success" />
              <p className="text-base font-semibold text-foreground">You're subscribed!</p>
              <p className="text-sm text-muted-foreground">Check your inbox for a confirmation email.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <label htmlFor="newsletter-email" className="sr-only">Email address</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      id="newsletter-email"
                      type="email"
                      placeholder="your@email.com"
                      {...register('email', {
                        required: 'Email is required',
                        pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' },
                      })}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                      aria-describedby={errors.email ? 'newsletter-email-error' : undefined}
                    />
                  </div>
                  {errors.email && (
                    <p id="newsletter-email-error" className="text-xs text-danger mt-1 text-left">{errors.email.message}</p>
                  )}
                </div>
                <select
                  {...register('board')}
                  className="px-4 py-3 rounded-xl bg-muted border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                  aria-label="Select your board"
                >
                  <option value="">Any Board</option>
                  <option value="WBBSE">WBBSE</option>
                  <option value="WBCHSE">WBCHSE</option>
                  <option value="CBSE">CBSE</option>
                  <option value="ICSE">ICSE</option>
                  <option value="ISC">ISC</option>
                </select>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap"
                >
                  {isSubmitting ? (
                    <><Loader2 size={15} className="animate-spin" /> Subscribing...</>
                  ) : (
                    'Subscribe Free'
                  )}
                </button>
              </div>
              <p className="text-[11px] text-muted-foreground mt-3">
                By subscribing, you agree to our{' '}
                <a href="/privacy" className="underline hover:text-foreground">Privacy Policy</a>.
                Unsubscribe any time.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}