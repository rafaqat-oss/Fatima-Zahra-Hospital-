import React, { useEffect, useState } from 'react';
import { Stethoscope, Loader2 } from 'lucide-react';

interface PageLoadingProgressProps {
  isLoading: boolean;
  targetTab?: string;
  language: 'en' | 'ur';
}

export const PageLoadingProgress: React.FC<PageLoadingProgressProps> = ({
  isLoading,
  targetTab,
  language
}) => {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  const isUrdu = language === 'ur';

  const getTabTitle = (tab?: string) => {
    switch (tab) {
      case 'home': return isUrdu ? 'ہوم پیج' : 'Home Page';
      case 'about': return isUrdu ? 'ہسپتال کی معلومات' : 'About Hospital';
      case 'departments': return isUrdu ? 'طبی شعبہ جات' : 'Medical Departments';
      case 'doctors': return isUrdu ? 'ماہر داکٹرز' : 'Consultant Doctors';
      case 'services': return isUrdu ? 'طبی سہولیات' : 'Hospital Services';
      case 'emergency': return isUrdu ? '24/7 ایمرجنسی' : '24/7 Emergency Ward';
      case 'dashboard': return isUrdu ? 'پورٹل ڈیش بورڈ' : 'User Dashboard';
      default: return isUrdu ? 'صفحہ تبدیل ہو رہا ہے...' : 'Navigating...';
    }
  };

  useEffect(() => {
    let timer1: NodeJS.Timeout;
    let timer2: NodeJS.Timeout;
    let timer3: NodeJS.Timeout;
    let timer4: NodeJS.Timeout;

    if (isLoading) {
      setVisible(true);
      setProgress(15);

      timer1 = setTimeout(() => setProgress(45), 80);
      timer2 = setTimeout(() => setProgress(80), 180);
      timer3 = setTimeout(() => setProgress(95), 300);
    } else {
      setProgress(100);
      timer4 = setTimeout(() => {
        setVisible(false);
        setProgress(0);
      }, 300);
    }

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [isLoading]);

  if (!visible && progress === 0) return null;

  return (
    <>
      {/* Top Fixed High-Contrast Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-[100] h-1 bg-slate-200/40 dark:bg-slate-800/40 overflow-hidden pointer-events-none">
        <div
          className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.8)] transition-all duration-300 ease-out"
          style={{
            width: `${progress}%`,
            opacity: progress === 100 ? 0 : 1
          }}
        />
      </div>

      {/* Floating Transition Toast Indicator (when loading) */}
      {isLoading && targetTab && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-2xl bg-slate-900/90 text-white dark:bg-slate-800/90 backdrop-blur-md border border-emerald-500/30 shadow-2xl flex items-center gap-2.5 text-xs font-bold animate-in slide-in-from-bottom-3 duration-200 pointer-events-none">
          <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          </div>
          <span>
            {isUrdu ? `${getTabTitle(targetTab)} کو لوڈ کیا جا رہا ہے...` : `Loading ${getTabTitle(targetTab)}...`}
          </span>
        </div>
      )}
    </>
  );
};
