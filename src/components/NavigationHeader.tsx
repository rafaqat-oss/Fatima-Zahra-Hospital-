import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, ArrowRight, Home, LayoutDashboard, ChevronRight, Menu, X, 
  Stethoscope, Building2, UserCheck, Activity, ShieldAlert, Bot, Phone,
  Heart, Clock, Sparkles
} from 'lucide-react';
import { UserProfile } from '../types';

interface NavigationHeaderProps {
  activeTab: string;
  onSelectTab: (tab: any) => void;
  historyStack: string[];
  historyIndex: number;
  onNavigateBack: () => void;
  onNavigateForward: () => void;
  user: UserProfile | null;
  language: 'en' | 'ur';
  onOpenChat: () => void;
  onOpenAuth: () => void;
  onOpenAppointment: () => void;
}

export const NavigationHeader: React.FC<NavigationHeaderProps> = ({
  activeTab,
  onSelectTab,
  historyStack,
  historyIndex,
  onNavigateBack,
  onNavigateForward,
  user,
  language,
  onOpenChat,
  onOpenAuth,
  onOpenAppointment
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const isUrdu = language === 'ur';

  const canGoBack = historyIndex > 0;
  const canGoForward = historyIndex < historyStack.length - 1;

  // Breadcrumb mapping
  const getBreadcrumbs = () => {
    const items = [{ id: 'home', label: isUrdu ? 'ہوم' : 'Home' }];

    switch (activeTab) {
      case 'about':
        items.push({ id: 'about', label: isUrdu ? 'ہسپتال کے بارے میں' : 'About Hospital' });
        break;
      case 'departments':
        items.push({ id: 'departments', label: isUrdu ? 'طبی شعبہ جات' : 'Medical Departments' });
        break;
      case 'doctors':
        items.push({ id: 'doctors', label: isUrdu ? 'ماہر داکٹرز' : 'Consultant Doctors' });
        break;
      case 'services':
        items.push({ id: 'services', label: isUrdu ? 'طبی سہولیات' : 'Hospital Services' });
        break;
      case 'emergency':
        items.push({ id: 'emergency', label: isUrdu ? '24/7 ایمرجنسی' : '24/7 Emergency Ward' });
        break;
      case 'dashboard':
        items.push({ id: 'dashboard', label: user ? `${user.displayName || user.email} (${user.role.toUpperCase()})` : (isUrdu ? 'ڈیش بورڈ' : 'User Dashboard') });
        break;
      default:
        break;
    }

    return items;
  };

  const navLinks = [
    { id: 'home', label: isUrdu ? 'ہوم' : 'Home', icon: Home },
    { id: 'about', label: isUrdu ? 'ہمارے بارے میں' : 'About Us', icon: Building2 },
    { id: 'departments', label: isUrdu ? 'شعبہ جات' : 'Departments', icon: Stethoscope },
    { id: 'doctors', label: isUrdu ? 'ڈاکٹرز' : 'Doctors', icon: UserCheck },
    { id: 'services', label: isUrdu ? 'سہولیات' : 'Services', icon: Activity },
    { id: 'emergency', label: isUrdu ? 'ایمرجنسی' : 'Emergency', icon: ShieldAlert },
    { id: 'dashboard', label: isUrdu ? 'پورٹل ڈیش بورڈ' : 'Portal Dashboard', icon: LayoutDashboard },
  ];

  return (
    <>
      {/* SECONDARY NAVIGATION BAR (Back/Forward, Home, Dashboard, Breadcrumbs) */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-2 text-xs sticky top-16 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* History & Direct Control Buttons */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Back Button */}
            <button
              onClick={onNavigateBack}
              disabled={!canGoBack}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-slate-700 dark:text-slate-300 flex items-center gap-1"
              title="Go Back (پچھلے صفحے پر جائیں)"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline font-medium">{isUrdu ? 'پیچھے' : 'Back'}</span>
            </button>

            {/* Forward Button */}
            <button
              onClick={onNavigateForward}
              disabled={!canGoForward}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-slate-700 dark:text-slate-300 flex items-center gap-1"
              title="Go Forward (اگلے صفحے پر جائیں)"
            >
              <span className="hidden sm:inline font-medium">{isUrdu ? 'آگے' : 'Forward'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 mx-1"></div>

            {/* Home Quick Button */}
            <button
              onClick={() => onSelectTab('home')}
              className={`p-1.5 rounded-lg border transition-colors flex items-center gap-1 font-semibold ${activeTab === 'home' ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400' : 'border-slate-200 dark:border-slate-800 hover:bg-slate-100 text-slate-700 dark:text-slate-300'}`}
              title="Return to Home"
            >
              <Home className="w-3.5 h-3.5" />
              <span className="hidden md:inline">{isUrdu ? 'ہوم' : 'Home'}</span>
            </button>

            {/* Dashboard Quick Button */}
            <button
              onClick={() => onSelectTab('dashboard')}
              className={`p-1.5 rounded-lg border transition-colors flex items-center gap-1 font-semibold ${activeTab === 'dashboard' ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400' : 'border-slate-200 dark:border-slate-800 hover:bg-slate-100 text-slate-700 dark:text-slate-300'}`}
              title="Go to User Dashboard"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span className="hidden md:inline">{isUrdu ? 'ڈیش بورڈ' : 'Dashboard'}</span>
            </button>
          </div>

          {/* Breadcrumbs Navigation */}
          <nav className="flex items-center gap-1.5 text-slate-500 overflow-x-auto py-1 scrollbar-none">
            {getBreadcrumbs().map((item, idx) => (
              <React.Fragment key={item.id}>
                {idx > 0 && <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />}
                <button
                  onClick={() => onSelectTab(item.id)}
                  className={`hover:underline whitespace-nowrap text-[11px] sm:text-xs font-semibold ${idx === getBreadcrumbs().length - 1 ? 'text-emerald-700 dark:text-emerald-400 font-extrabold' : 'text-slate-600 dark:text-slate-400'}`}
                >
                  {item.label}
                </button>
              </React.Fragment>
            ))}
          </nav>

          {/* Mobile Navigation Drawer Trigger */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onOpenChat}
              className="px-2.5 py-1 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-[11px] flex items-center gap-1 shadow-xs"
            >
              <Bot className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">AI Assistant</span>
            </button>

            <button
              onClick={() => setIsDrawerOpen(true)}
              className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200"
              title="Open Navigation Drawer"
            >
              <Menu className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>

      {/* MOBILE NAVIGATION DRAWER & SIDEBAR SLIDE-OVER */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-xs h-full bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-200">
            
            <div className="space-y-6">
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold">
                    <Heart className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Fatima Zahra</h3>
                    <span className="text-[10px] text-slate-400 block">Ranewal Syedan</span>
                  </div>
                </div>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Nav Links */}
              <div className="space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 px-2">
                  {isUrdu ? 'ہسپتال کے نیویگیشن صفحات' : 'Main Hospital Sections'}
                </div>
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = activeTab === link.id;
                  return (
                    <button
                      key={link.id}
                      onClick={() => {
                        onSelectTab(link.id);
                        setIsDrawerOpen(false);
                      }}
                      className={`w-full text-left p-3 rounded-2xl text-xs font-bold flex items-center justify-between transition-colors ${isActive ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4" />
                        <span>{link.label}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 opacity-60" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Drawer Bottom Actions */}
            <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => {
                  onOpenAppointment();
                  setIsDrawerOpen(false);
                }}
                className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-colors"
              >
                {isUrdu ? 'اپائنٹمنٹ بک کریں' : 'Book Appointment'}
              </button>

              <button
                onClick={() => {
                  onOpenChat();
                  setIsDrawerOpen(false);
                }}
                className="w-full py-3 rounded-2xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-2"
              >
                <Bot className="w-4 h-4" />
                <span>{isUrdu ? 'AI طبی معاون' : 'AI Health Assistant'}</span>
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
