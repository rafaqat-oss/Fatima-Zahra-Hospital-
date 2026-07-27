import React, { useState } from 'react';
import { Star, MessageSquare, Send, CheckCircle2, Heart } from 'lucide-react';
import { FeedbackItem } from '../types';
import { initialFeedback } from '../data/initialData';
import { submitFeedback } from '../lib/firebase';

interface FeedbackSectionProps {
  language: 'en' | 'ur';
}

export const FeedbackSection: React.FC<FeedbackSectionProps> = ({ language }) => {
  const isUrdu = language === 'ur';

  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>(initialFeedback);
  const [name, setName] = useState('');
  const [rating, setRating] = useState(5);
  const [category, setCategory] = useState('General OPD & Staff');
  const [comment, setComment] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !comment) return;

    setIsSubmitting(true);
    try {
      const newItem = await submitFeedback({
        name,
        rating,
        category,
        comment
      });

      setFeedbacks(prev => [newItem, ...prev]);
      setSubmitted(true);
      setName('');
      setComment('');
    } catch (e) {
      console.error('Failed feedback submission:', e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-16 bg-white dark:bg-slate-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{isUrdu ? 'عوامی رائے' : 'Community Feedback'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            {isUrdu ? 'مریضوں کے تاثرات اور تجربات' : 'What Patients Say About Fatima Zahra Hospital'}
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base">
            {isUrdu ? 'رانیوال سیداں اور ملحقہ علاقوں کے شہریوں کا اعتماد اور محبت' : 'Real reviews from families in Ranewal Syedan and Gujrat.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Reviews List */}
          <div className="lg:col-span-7 space-y-4">
            {feedbacks.map((fb) => (
              <div
                key={fb.id}
                className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="font-extrabold text-base text-slate-900 dark:text-white">{fb.name}</div>
                  <div className="flex items-center text-amber-400">
                    {[...Array(fb.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                </div>

                <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  Category: {fb.category}
                </div>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 italic leading-relaxed">
                  "{fb.comment}"
                </p>

                <div className="text-[10px] text-slate-400 font-medium">{fb.date}</div>
              </div>
            ))}
          </div>

          {/* Submit Review Form */}
          <div className="lg:col-span-5">
            <div className="p-6 sm:p-8 rounded-3xl bg-emerald-900 text-white shadow-xl space-y-5">
              <div>
                <h3 className="text-xl font-extrabold flex items-center gap-2">
                  <Heart className="w-5 h-5 text-emerald-300" />
                  <span>{isUrdu ? 'اپنی رائے درج کریں' : 'Share Your Experience'}</span>
                </h3>
                <p className="text-xs text-emerald-200 mt-1">
                  Help us improve hospital services for all patients.
                </p>
              </div>

              {submitted ? (
                <div className="p-4 rounded-2xl bg-emerald-800 border border-emerald-700 text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-300 mx-auto" />
                  <div className="font-bold text-sm">Thank you for your feedback!</div>
                  <p className="text-xs text-emerald-200">Your review has been recorded.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-emerald-200 mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Syed Ali Hassan"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full p-3 rounded-xl bg-emerald-950/80 border border-emerald-700 text-white text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-emerald-200 mb-1">Rating</label>
                      <select
                        value={rating}
                        onChange={(e) => setRating(Number(e.target.value))}
                        className="w-full p-3 rounded-xl bg-emerald-950/80 border border-emerald-700 text-white text-xs font-bold"
                      >
                        <option value={5}>⭐⭐⭐⭐⭐ (5/5)</option>
                        <option value={4}>⭐⭐⭐⭐ (4/5)</option>
                        <option value={3}>⭐⭐⭐ (3/5)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-emerald-200 mb-1">Department</label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full p-3 rounded-xl bg-emerald-950/80 border border-emerald-700 text-white text-xs font-bold"
                      >
                        <option value="General OPD & Staff">General OPD</option>
                        <option value="Maternity Care">Maternity Care</option>
                        <option value="Emergency Room">Emergency Room</option>
                        <option value="Lab & Dispensary">Lab & Dispensary</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-emerald-200 mb-1">Comment / تاثرات *</label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Write your review here..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="w-full p-3 rounded-xl bg-emerald-950/80 border border-emerald-700 text-white text-xs"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 rounded-xl bg-white text-emerald-900 font-extrabold text-xs shadow-md flex items-center justify-center gap-2 hover:bg-emerald-50 transition-colors"
                  >
                    <Send className="w-4 h-4 text-emerald-700" />
                    <span>{isSubmitting ? 'Submitting...' : 'Submit Feedback'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
