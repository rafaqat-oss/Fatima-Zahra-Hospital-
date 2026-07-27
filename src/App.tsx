import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, getUserProfile, seedInitialFirestoreData } from './lib/firebase';
import { UserProfile, Doctor, Appointment } from './types';
import { ShieldAlert, Lock, User } from 'lucide-react';

// Components
import { Navbar } from './components/Navbar';
import { NavigationHeader } from './components/NavigationHeader';
import { SectionPagination } from './components/SectionPagination';
import { PageLoadingProgress } from './components/PageLoadingProgress';
import { Hero } from './components/Hero';
import { AboutHospital } from './components/AboutHospital';
import { ServicesSection } from './components/ServicesSection';
import { DepartmentsSection } from './components/DepartmentsSection';
import { DoctorsSection } from './components/DoctorsSection';
import { EmergencyBanner } from './components/EmergencyBanner';
import { FeedbackSection } from './components/FeedbackSection';
import { Footer } from './components/Footer';

// Modals & Panels
import { AIChatbot } from './components/AIChatbot';
import { AppointmentModal } from './components/AppointmentModal';
import { AuthModal } from './components/AuthModal';
import { UserProfileModal } from './components/UserProfileModal';
import { AmbulanceBookingModal } from './components/AmbulanceBookingModal';
import { BedAvailabilityModal } from './components/BedAvailabilityModal';
import { PharmacyDispensaryModal } from './components/PharmacyDispensaryModal';
import { BloodBankModal } from './components/BloodBankModal';

// Dashboards
import { PatientDashboard } from './components/PatientDashboard';
import { DoctorDashboard } from './components/DoctorDashboard';
import { AdminDashboard } from './components/AdminDashboard';

export default function App() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [language, setLanguage] = useState<'en' | 'ur'>('en');
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'home' | 'about' | 'departments' | 'doctors' | 'services' | 'emergency' | 'dashboard'>('home');

  // Navigation History Stack Management (for Back / Forward support)
  const [historyStack, setHistoryStack] = useState<string[]>(['home']);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  // Modal Controls
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [isAppointmentOpen, setIsAppointmentOpen] = useState<boolean>(false);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [isAmbulanceOpen, setIsAmbulanceOpen] = useState<boolean>(false);
  const [isBedsOpen, setIsBedsOpen] = useState<boolean>(false);
  const [isPharmacyOpen, setIsPharmacyOpen] = useState<boolean>(false);
  const [isBloodBankOpen, setIsBloodBankOpen] = useState<boolean>(false);

  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDeptId, setSelectedDeptId] = useState<string | null>(null);

  // Page Transition Loading Indicator States
  const [isNavigating, setIsNavigating] = useState<boolean>(false);
  const [pendingTab, setPendingTab] = useState<string>('home');

  // Synchronize Tab Change with History Stack & Browser pushState
  const handleSelectTab = (tab: any, skipHistoryUpdate: boolean = false) => {
    setPendingTab(tab);
    setIsNavigating(true);

    setTimeout(() => {
      setActiveTab(tab);
      setIsNavigating(false);

      if (!skipHistoryUpdate) {
        setHistoryStack(prev => {
          const sliced = prev.slice(0, historyIndex + 1);
          if (sliced[sliced.length - 1] !== tab) {
            return [...sliced, tab];
          }
          return sliced;
        });
        setHistoryIndex(prev => {
          const sliced = historyStack.slice(0, prev + 1);
          return sliced[sliced.length - 1] !== tab ? prev + 1 : prev;
        });

        try {
          window.history.pushState({ tab }, '', `#${tab}`);
        } catch (e) {
          console.warn('Browser history note:', e);
        }
      }

      if (tab !== 'dashboard') {
        setTimeout(() => {
          const el = document.getElementById(tab);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
          else window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 50);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 200);
  };

  const handleNavigateBack = () => {
    if (historyIndex > 0) {
      const prevIndex = historyIndex - 1;
      const targetTab = historyStack[prevIndex];
      setHistoryIndex(prevIndex);
      handleSelectTab(targetTab, true);
    }
  };

  const handleNavigateForward = () => {
    if (historyIndex < historyStack.length - 1) {
      const nextIndex = historyIndex + 1;
      const targetTab = historyStack[nextIndex];
      setHistoryIndex(nextIndex);
      handleSelectTab(targetTab, true);
    }
  };

  // Listen to browser native back/forward popstate
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (event.state && event.state.tab) {
        setActiveTab(event.state.tab);
      } else if (window.location.hash) {
        const hashTab = window.location.hash.replace('#', '');
        if (['home', 'about', 'departments', 'doctors', 'services', 'emergency', 'dashboard'].includes(hashTab)) {
          setActiveTab(hashTab as any);
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Sync dark mode class on HTML document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Firebase Auth Listener & Seed Data
  useEffect(() => {
    seedInitialFirestoreData();

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const profile = await getUserProfile(firebaseUser.uid);
        if (profile) {
          setUser(profile);
        } else {
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Patient',
            role: 'patient'
          });
        }
      } else {
        // Retain client demo user if logged in via demo button
        setUser(prev => (prev?.uid.startsWith('demo-') ? prev : null));
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn('Signout note:', e);
    }
    setUser(null);
    setActiveTab('home');
  };

  const handleBookDoctor = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setSelectedDeptId(doctor.departmentId);
    setIsAppointmentOpen(true);
  };

  const handleSelectDepartment = (deptId: string) => {
    setSelectedDeptId(deptId);
    setSelectedDoctor(null);
    setIsAppointmentOpen(true);
  };

  return (
    <div className={`min-h-screen bg-[#F4F7F5] dark:bg-[#0D1E17] text-[#1A1A1B] dark:text-emerald-50 font-sans transition-colors duration-200 ${language === 'ur' ? 'font-serif' : ''}`}>
      
      {/* Page Navigation & Data Fetching Progress Indicator */}
      <PageLoadingProgress
        isLoading={isNavigating}
        targetTab={pendingTab}
        language={language}
      />

      {/* Primary Sticky Header Navbar */}
      <Navbar
        user={user}
        language={language}
        setLanguage={setLanguage}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenProfileModal={() => setIsProfileOpen(true)}
        onOpenAppointment={() => {
          setSelectedDoctor(null);
          setSelectedDeptId(null);
          setIsAppointmentOpen(true);
        }}
        onOpenChat={() => setIsChatOpen(true)}
        onSelectTab={handleSelectTab}
        activeTab={activeTab}
        onLogout={handleLogout}
      />

      {/* Secondary Navigation Bar (Back / Forward, Home, Dashboard, Breadcrumbs, Drawer) */}
      <NavigationHeader
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        historyStack={historyStack}
        historyIndex={historyIndex}
        onNavigateBack={handleNavigateBack}
        onNavigateForward={handleNavigateForward}
        user={user}
        language={language}
        onOpenChat={() => setIsChatOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenAppointment={() => setIsAppointmentOpen(true)}
      />

      {/* View Switcher: Protected Role Dashboard vs Main Landing Page */}
      {activeTab === 'dashboard' ? (
        user ? (
          user.role === 'admin' ? (
            <AdminDashboard user={user} language={language} />
          ) : user.role === 'doctor' ? (
            <DoctorDashboard user={user} language={language} />
          ) : (
            <PatientDashboard
              user={user}
              language={language}
              onNewAppointment={() => {
                setSelectedDoctor(null);
                setSelectedDeptId(null);
                setIsAppointmentOpen(true);
              }}
            />
          )
        ) : (
          <div className="py-20 px-4 min-h-[65vh] flex items-center justify-center bg-slate-50 dark:bg-slate-950/60 transition-colors">
            <div className="max-w-md w-full p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl text-center space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center shadow-inner">
                <ShieldAlert className="w-8 h-8" />
              </div>
              <div>
                <span className="text-xs font-bold text-amber-600 uppercase tracking-wider block">Protected Route</span>
                <h2 className="text-xl font-black text-slate-900 dark:text-white mt-1">
                  {language === 'ur' ? 'اکاؤنٹ میں لاگ ان کریں' : 'Authentication Required'}
                </h2>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  {language === 'ur'
                    ? 'ڈیش بورڈ، اپائنٹمنٹس اور پورٹل ریکارڈ تک رسائی کے لیے سائن ان کریں۔'
                    : 'Please sign in or register a patient account to access your digital consultation queue, prescriptions, and medical records.'}
                </p>
              </div>
              <button
                onClick={() => setIsAuthOpen(true)}
                className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all hover:scale-[1.02]"
              >
                {language === 'ur' ? 'سائن ان / نیا اکاؤنٹ بنائیں' : 'Sign In / Register Account'}
              </button>
            </div>
          </div>
        )
      ) : (
        <main className="space-y-0">
          <Hero
            language={language}
            onOpenAppointment={() => setIsAppointmentOpen(true)}
            onOpenChat={() => setIsChatOpen(true)}
            onNavigate={(tab) => handleSelectTab(tab)}
            onOpenAmbulance={() => setIsAmbulanceOpen(true)}
            onOpenBeds={() => setIsBedsOpen(true)}
            onOpenPharmacy={() => setIsPharmacyOpen(true)}
            onOpenBloodBank={() => setIsBloodBankOpen(true)}
          />

          <AboutHospital language={language} />

          <ServicesSection
            language={language}
            onOpenAppointment={() => setIsAppointmentOpen(true)}
          />

          <DepartmentsSection
            language={language}
            onSelectDepartment={handleSelectDepartment}
          />

          <DoctorsSection
            language={language}
            onBookDoctor={handleBookDoctor}
          />

          <EmergencyBanner
            language={language}
            onOpenAmbulance={() => setIsAmbulanceOpen(true)}
          />

          <FeedbackSection language={language} />
        </main>
      )}

      {/* Page / Section Sequence Pagination Controls */}
      <SectionPagination
        currentTab={activeTab}
        onSelectTab={handleSelectTab}
        language={language}
      />

      {/* Footer */}
      <Footer
        language={language}
        onNavigate={(tab) => handleSelectTab(tab)}
        onOpenAppointment={() => setIsAppointmentOpen(true)}
        onOpenChat={() => setIsChatOpen(true)}
      />

      {/* AI Chatbot Floating Modal / Window */}
      <AIChatbot
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        user={user}
        language={language}
        onBookAppointment={(deptId, doctorId) => {
          setIsChatOpen(false);
          setSelectedDeptId(deptId || null);
          setIsAppointmentOpen(true);
        }}
      />

      {/* Appointment Booking Modal Wizard */}
      <AppointmentModal
        isOpen={isAppointmentOpen}
        onClose={() => setIsAppointmentOpen(false)}
        user={user}
        selectedDoctor={selectedDoctor}
        selectedDeptId={selectedDeptId}
        language={language}
        onAppointmentCreated={(appt) => {
          console.log('Appointment confirmed:', appt);
        }}
      />

      {/* Firebase Auth Modal (Login / Signup / Reset / Demo Logins) */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={(profile) => {
          setUser(profile);
          setActiveTab('dashboard');
        }}
        language={language}
      />

      {/* User Profile & Security Settings Modal */}
      {user && (
        <UserProfileModal
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
          user={user}
          onProfileUpdated={(updatedProfile) => {
            setUser(updatedProfile);
          }}
          onAccountDeleted={() => {
            handleLogout();
          }}
          language={language}
        />
      )}

      {/* Facility Modals */}
      <AmbulanceBookingModal
        isOpen={isAmbulanceOpen}
        onClose={() => setIsAmbulanceOpen(false)}
        language={language}
      />

      <BedAvailabilityModal
        isOpen={isBedsOpen}
        onClose={() => setIsBedsOpen(false)}
        language={language}
      />

      <PharmacyDispensaryModal
        isOpen={isPharmacyOpen}
        onClose={() => setIsPharmacyOpen(false)}
        language={language}
      />

      <BloodBankModal
        isOpen={isBloodBankOpen}
        onClose={() => setIsBloodBankOpen(false)}
        language={language}
      />

    </div>
  );
}

