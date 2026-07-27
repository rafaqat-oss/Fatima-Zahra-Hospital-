import React from 'react';
import { ArrowLeft, ArrowRight, Home, LayoutDashboard, ChevronUp } from 'lucide-react';

interface SectionPaginationProps {
  currentTab: string;
  onSelectTab: (tab: any) => void;
  language: 'en' | 'ur';
}

export const SectionPagination: React.FC<SectionPaginationProps> = ({
  currentTab,
  onSelectTab,
  language
}) => {
  const isUrdu = language === 'ur';

  const tabSequence = ['home', 'about', 'services', 'departments', 'doctors', 'emergency', 'dashboard'];
  const currentIndex = tabSequence.indexOf(currentTab);

  if (currentIndex === -1) return null;

  const prevTab = currentIndex > 0 ? tabSequence[currentIndex - 1] : null;
  const nextTab = currentIndex < tabSequence.length - 1 ? tabSequence[currentIndex + 1] : null;

  const getTabLabel = (tabId: string) => {
    switch (tabId) {
      case 'home': return isUrdu ? 'ہوم پیج' : 'Home Page';
      case 'about': return isUrdu ? 'ہسپتال کے بارے میں' : 'About Hospital';
      case 'services': return isUrdu ? 'طبی سہولیات' : 'Hospital Services';
      case 'departments': return isUrdu ? 'طبی شعبہ جات' : 'Medical Departments';
      case 'doctors': return isUrdu ? 'ماہر داکٹرز' : 'Consultant Doctors';
      case 'emergency': return isUrdu ? 'ایمرجنسی سروسز' : 'Emergency Services';
      case 'dashboard': return isUrdu ? 'پورٹل ڈیش بورڈ' : 'User Dashboard';
      default: return tabId;
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="py-8 px-4 bg-slate-100/70 dark:bg-slate-950/60 border-t border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold">
        
        {/* Previous Section Button */}
        <div>
          {prevTab ? (
            <button
              onClick={() => {
                onSelectTab(prevTab);
                scrollToTop();
              }}
              className="px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 hover:text-emerald-700 dark:hover:text-emerald-400 hover:border-emerald-300 transition-all flex items-center gap-2 shadow-xs"
            >
              <ArrowLeft className="w-4 h-4 text-emerald-600" />
              <span>{isUrdu ? 'پچھلا صفحہ:' : 'Previous Section:'} <span className="font-extrabold">{getTabLabel(prevTab)}</span></span>
            </button>
          ) : (
            <div className="w-32"></div>
          )}
        </div>

        {/* Scroll To Top & Quick Home */}
        <div className="flex items-center gap-2">
          <button
            onClick={scrollToTop}
            className="p-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-1"
            title="Return to top of page"
          >
            <ChevronUp className="w-4 h-4" />
            <span>{isUrdu ? 'اوپر جائیں' : 'Top'}</span>
          </button>

          <button
            onClick={() => {
              onSelectTab('home');
              scrollToTop();
            }}
            className="px-3 py-2 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-200 transition-colors flex items-center gap-1.5"
          >
            <Home className="w-3.5 h-3.5" />
            <span>{isUrdu ? 'ہوم' : 'Home'}</span>
          </button>

          <button
            onClick={() => {
              onSelectTab('dashboard');
              scrollToTop();
            }}
            className="px-3 py-2 rounded-2xl bg-teal-100 dark:bg-teal-950/80 text-teal-800 dark:text-teal-300 hover:bg-teal-200 transition-colors flex items-center gap-1.5"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>{isUrdu ? 'ڈیش بورڈ' : 'Dashboard'}</span>
          </button>
        </div>

        {/* Next Section Button */}
        <div>
          {nextTab ? (
            <button
              onClick={() => {
                onSelectTab(nextTab);
                scrollToTop();
              }}
              className="px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 hover:text-emerald-700 dark:hover:text-emerald-400 hover:border-emerald-300 transition-all flex items-center gap-2 shadow-xs"
            >
              <span>{isUrdu ? 'اگلا صفحہ:' : 'Next Section:'} <span className="font-extrabold">{getTabLabel(nextTab)}</span></span>
              <ArrowRight className="w-4 h-4 text-emerald-600" />
            </button>
          ) : (
            <div className="w-32"></div>
          )}
        </div>

      </div>
    </div>
  );
};
