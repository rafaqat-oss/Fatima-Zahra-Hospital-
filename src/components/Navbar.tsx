import React from 'react';
import { Stethoscope, Phone, Bot, Calendar, User, Moon, Sun, Globe, LogOut, ShieldAlert, Heart, Menu, X, Settings } from 'lucide-react';
import { UserProfile } from '../types';
import { hospitalDetails } from '../data/initialData';

interface NavbarProps {
  user: UserProfile | null;
  language: 'en' | 'ur';
  setLanguage: (lang: 'en' | 'ur') => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  onOpenAuth: () => void;
  onOpenAppointment: () => void;
  onOpenChat: () => void;
  onOpenProfileModal?: () => void;
  onSelectTab: (tab: 'home' | 'about' | 'departments' | 'doctors' | 'services' | 'emergency' | 'dashboard') => void;
  activeTab: string;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  language,
  setLanguage,
  darkMode,
  setDarkMode,
  onOpenAuth,
  onOpenAppointment,
  onOpenChat,
  onOpenProfileModal,
  onSelectTab,
  activeTab,
  onLogout
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const isUrdu = language === 'ur';

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/90 dark:bg-slate-900/90 border-b border-emerald-100 dark:border-slate-800 transition-colors duration-200">
      {/* Top Bar - Emergency Phone & Address */}
      <div className="bg-emerald-700 dark:bg-emerald-950 text-white text-xs sm:text-sm py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-1 sm:gap-4">
          <div className="flex items-center gap-2 font-medium">
            <span className="inline-flex items-center gap-1 bg-red-600 px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider animate-pulse">
              <ShieldAlert className="w-3 h-3" /> 24/7 Helpline
            </span>
            <a href={`tel:${hospitalDetails.phone}`} className="hover:underline flex items-center gap-1 font-semibold">
              <Phone className="w-3.5 h-3.5" /> {hospitalDetails.phone} ({hospitalDetails.contactPerson})
            </a>
          </div>
          <div className="flex items-center gap-3 text-emerald-100 text-[11px] sm:text-xs">
            <span>📍 {hospitalDetails.location}</span>
            <span className="hidden md:inline">|</span>
            <span className="hidden md:inline text-amber-200 font-medium">
              💚 Founded by {hospitalDetails.founder}
            </span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Hospital Name */}
          <button 
            onClick={() => onSelectTab('home')}
            className="flex items-center gap-3 text-left focus:outline-none group"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
              <Heart className="w-7 h-7 fill-emerald-100 text-emerald-600" />
            </div>
            <div>
              <div className="font-extrabold text-lg sm:text-xl text-slate-900 dark:text-white leading-tight flex items-center gap-2">
                {isUrdu ? hospitalDetails.urduName : hospitalDetails.name}
              </div>
              <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                {isUrdu ? 'رانیوال سیداں، ضلع گجرات (ویلفیئر ہسپتال)' : 'Ranewal Syedan, District Gujrat'}
              </div>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 text-sm font-medium text-slate-700 dark:text-slate-200">
            <button
              onClick={() => onSelectTab('home')}
              className={`px-3 py-2 rounded-lg transition-colors ${activeTab === 'home' ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-semibold' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}
            >
              {isUrdu ? 'صفحہ اول' : 'Home'}
            </button>
            <button
              onClick={() => onSelectTab('about')}
              className={`px-3 py-2 rounded-lg transition-colors ${activeTab === 'about' ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-semibold' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}
            >
              {isUrdu ? 'ہمارے بارے میں' : 'About Hospital'}
            </button>
            <button
              onClick={() => onSelectTab('departments')}
              className={`px-3 py-2 rounded-lg transition-colors ${activeTab === 'departments' ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-semibold' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}
            >
              {isUrdu ? 'شعبہ جات' : 'Departments'}
            </button>
            <button
              onClick={() => onSelectTab('doctors')}
              className={`px-3 py-2 rounded-lg transition-colors ${activeTab === 'doctors' ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-semibold' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}
            >
              {isUrdu ? 'ڈاکٹرز' : 'Doctors'}
            </button>
            <button
              onClick={() => onSelectTab('services')}
              className={`px-3 py-2 rounded-lg transition-colors ${activeTab === 'services' ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-semibold' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}
            >
              {isUrdu ? 'سہولیات' : 'Services'}
            </button>
            <button
              onClick={() => onSelectTab('emergency')}
              className={`px-3 py-2 rounded-lg transition-colors text-red-600 dark:text-red-400 font-bold ${activeTab === 'emergency' ? 'bg-red-50 dark:bg-red-950/60' : 'hover:bg-red-50/50 dark:hover:bg-red-950/30'}`}
            >
              🚨 {isUrdu ? 'ایمرجنسی' : 'Emergency'}
            </button>
            {user && (
              <button
                onClick={() => onSelectTab('dashboard')}
                className={`px-3 py-2 rounded-lg transition-colors ${activeTab === 'dashboard' ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-semibold' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}
              >
                {user.role === 'admin' ? (isUrdu ? 'ایڈمن پینل' : 'Admin Panel') : user.role === 'doctor' ? (isUrdu ? 'ڈاکٹر پورٹل' : 'Doctor Portal') : (isUrdu ? 'میرا ریکارڈ' : 'My Appointments')}
              </button>
            )}
          </nav>

          {/* Controls & Action Buttons */}
          <div className="hidden sm:flex items-center gap-2">
            {/* Language Toggle */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'ur' : 'en')}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5 text-xs font-semibold"
              title="Switch Language / زبان تبدیل کریں"
            >
              <Globe className="w-4 h-4 text-emerald-600" />
              <span>{language === 'en' ? 'اردو' : 'English'}</span>
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              title="Toggle Dark/Light Mode"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* AI Assistant Quick Trigger */}
            <button
              onClick={onOpenChat}
              className="px-3 py-2 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 hover:bg-teal-100 dark:hover:bg-teal-900 border border-teal-200 dark:border-teal-800 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Bot className="w-4 h-4 text-teal-600 dark:text-teal-400 animate-bounce" />
              <span>{isUrdu ? 'AI طبی معاون' : 'AI Health Bot'}</span>
            </button>

            {/* Book Appointment CTA */}
            <button
              onClick={onOpenAppointment}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-md shadow-emerald-600/20 flex items-center gap-1.5 transition-all hover:scale-105"
            >
              <Calendar className="w-4 h-4" />
              <span>{isUrdu ? 'اپائنٹمنٹ بک کریں' : 'Book Appointment'}</span>
            </button>

            {/* Auth / Profile Button */}
            {user ? (
              <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200 dark:border-slate-800">
                <button
                  onClick={() => onSelectTab('dashboard')}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-semibold hover:bg-emerald-200 dark:hover:bg-emerald-900 transition-colors"
                >
                  <User className="w-3.5 h-3.5" />
                  <span className="max-w-[100px] truncate">{user.displayName || user.email.split('@')[0]}</span>
                </button>
                {onOpenProfileModal && (
                  <button
                    onClick={onOpenProfileModal}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 transition-colors"
                    title="Account & Security Settings"
                  >
                    <Settings className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={onLogout}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-xs transition-colors flex items-center gap-1"
              >
                <User className="w-3.5 h-3.5" />
                <span>{isUrdu ? 'لاگ ان' : 'Sign In'}</span>
              </button>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={() => setLanguage(language === 'en' ? 'ur' : 'en')}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-bold"
            >
              {language === 'en' ? 'اردو' : 'EN'}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-3 pb-6 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => { onSelectTab('home'); setMobileMenuOpen(false); }}
              className="p-2.5 rounded-lg text-left text-sm font-medium bg-slate-50 dark:bg-slate-800"
            >
              {isUrdu ? 'صفحہ اول' : 'Home'}
            </button>
            <button
              onClick={() => { onSelectTab('about'); setMobileMenuOpen(false); }}
              className="p-2.5 rounded-lg text-left text-sm font-medium bg-slate-50 dark:bg-slate-800"
            >
              {isUrdu ? 'ہمارے بارے میں' : 'About Hospital'}
            </button>
            <button
              onClick={() => { onSelectTab('departments'); setMobileMenuOpen(false); }}
              className="p-2.5 rounded-lg text-left text-sm font-medium bg-slate-50 dark:bg-slate-800"
            >
              {isUrdu ? 'شعبہ جات' : 'Departments'}
            </button>
            <button
              onClick={() => { onSelectTab('doctors'); setMobileMenuOpen(false); }}
              className="p-2.5 rounded-lg text-left text-sm font-medium bg-slate-50 dark:bg-slate-800"
            >
              {isUrdu ? 'ڈاکٹرز' : 'Doctors'}
            </button>
            <button
              onClick={() => { onSelectTab('services'); setMobileMenuOpen(false); }}
              className="p-2.5 rounded-lg text-left text-sm font-medium bg-slate-50 dark:bg-slate-800"
            >
              {isUrdu ? 'سہولیات' : 'Services'}
            </button>
            <button
              onClick={() => { onSelectTab('emergency'); setMobileMenuOpen(false); }}
              className="p-2.5 rounded-lg text-left text-sm font-bold bg-red-50 text-red-600 dark:bg-red-950/60 dark:text-red-400"
            >
              🚨 {isUrdu ? 'ایمرجنسی' : 'Emergency'}
            </button>
          </div>

          <div className="flex flex-col gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={() => { onOpenAppointment(); setMobileMenuOpen(false); }}
              className="w-full py-2.5 rounded-xl bg-emerald-600 text-white font-semibold text-sm flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>{isUrdu ? 'اپائنٹمنٹ بک کریں' : 'Book Appointment'}</span>
            </button>
            <button
              onClick={() => { onOpenChat(); setMobileMenuOpen(false); }}
              className="w-full py-2.5 rounded-xl bg-teal-600 text-white font-semibold text-sm flex items-center justify-center gap-2"
            >
              <Bot className="w-4 h-4" />
              <span>{isUrdu ? 'AI طبی معاون سے بات کریں' : 'Talk to AI Health Assistant'}</span>
            </button>

            {user ? (
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-100 dark:bg-slate-800 mt-2">
                <div>
                  <div className="font-semibold text-sm text-slate-800 dark:text-slate-100">{user.displayName}</div>
                  <div className="text-xs text-slate-500 capitalize">{user.role}</div>
                </div>
                <button
                  onClick={() => { onLogout(); setMobileMenuOpen(false); }}
                  className="p-2 text-red-600 font-semibold text-xs flex items-center gap-1"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => { onOpenAuth(); setMobileMenuOpen(false); }}
                className="w-full py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-center font-semibold text-sm"
              >
                {isUrdu ? 'سائن ان / سائن اپ' : 'Sign In / Sign Up'}
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
