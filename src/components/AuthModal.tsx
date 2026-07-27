import React, { useState } from 'react';
import { X, User, Lock, Mail, Phone, Shield, ArrowRight, CheckCircle2, KeyRound, Loader2 } from 'lucide-react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, sendEmailVerification } from 'firebase/auth';
import { auth, createUserProfile, getUserProfile, configureAuthPersistence } from '../lib/firebase';
import { UserProfile, UserRole } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (userProfile: UserProfile) => void;
  language: 'en' | 'ur';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  language
}) => {
  const isUrdu = language === 'ur';

  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [role, setRole] = useState<UserRole>('patient');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [phone, setPhone] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  // Handle Firebase Login / Signup / Reset
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (mode === 'signup') {
      if (password !== confirmPassword) {
        setError(isUrdu ? 'پاس ورڈ اور تصدیقی پاس ورڈ کا ملنا ضروری ہے۔' : 'Passwords do not match. Please verify your password.');
        return;
      }
      if (password.length < 6) {
        setError(isUrdu ? 'پاس ورڈ کم از کم 6 ہندسوں کا ہونا چاہیے۔' : 'Password must be at least 6 characters long.');
        return;
      }
    }

    setIsLoading(true);

    try {
      if (mode === 'login') {
        await configureAuthPersistence(rememberMe);
        const userCred = await signInWithEmailAndPassword(auth, email, password);
        let profile = await getUserProfile(userCred.user.uid);
        if (!profile) {
          profile = {
            uid: userCred.user.uid,
            email: userCred.user.email || email,
            displayName: userCred.user.displayName || email.split('@')[0],
            role,
            phone
          };
        }
        onLoginSuccess(profile);
        onClose();
      } else if (mode === 'signup') {
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        
        // Trigger Email Verification
        try {
          await sendEmailVerification(userCred.user);
        } catch (vErr) {
          console.warn('Email verification send note:', vErr);
        }

        const newProfile = await createUserProfile(userCred.user.uid, {
          email,
          displayName: displayName || email.split('@')[0],
          role,
          phone
        });

        setSuccessMsg(
          isUrdu 
            ? 'اکاؤنٹ کامیابی سے بن گیا! ایک تصدیقی ای میل بھیج دی گئی ہے۔' 
            : 'Account created successfully! A verification email has been sent to your email address.'
        );

        setTimeout(() => {
          onLoginSuccess(newProfile);
          onClose();
        }, 1500);

      } else if (mode === 'forgot') {
        await sendPasswordResetEmail(auth, email);
        setSuccessMsg(
          isUrdu 
            ? 'پاس ورڈ ری سیٹ کا لنک آپ کی ای میل پر بھیج دیا گیا ہے۔ براہ کرم اپنا ان باکس چیک کریں۔' 
            : 'Password reset link sent! Please check your email inbox to reset your password.'
        );
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      let message = err?.message || 'Authentication failed. Please check credentials.';
      if (err?.code === 'auth/user-not-found' || err?.code === 'auth/wrong-password' || err?.code === 'auth/invalid-credential') {
        message = isUrdu ? 'غلط ای میل یا پاس ورڈ۔ براہ کرم دوبارہ کوشش کریں۔' : 'Invalid email or password. Please try again.';
      } else if (err?.code === 'auth/email-already-in-use') {
        message = isUrdu ? 'یہ ای میل پہلے سے استعمال میں ہے۔' : 'This email address is already registered.';
      }
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  // Instant Demo Mode Switchers
  const handleDemoLogin = (demoRole: UserRole) => {
    const demoProfiles: Record<UserRole, UserProfile> = {
      patient: {
        uid: 'demo-patient-1',
        email: 'patient@fatimazahra.org',
        displayName: 'Syed Tariq Ali (Patient)',
        role: 'patient',
        phone: '+92 300 9876543'
      },
      doctor: {
        uid: 'demo-doc-1',
        email: 'doctor@fatimazahra.org',
        displayName: 'Dr. Syed Mujahid Hussain Shah',
        role: 'doctor',
        phone: '+92 336 1992199'
      },
      admin: {
        uid: 'demo-admin-1',
        email: 'admin@fatimazahra.org',
        displayName: 'Hospital Trustee Administrator',
        role: 'admin',
        phone: '+92 336 1992199'
      }
    };

    onLoginSuccess(demoProfiles[demoRole]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6 my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
              {isUrdu ? 'فاطمہ زہرہ ہسپتال' : 'Fatima Zahra Hospital'}
            </div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white">
              {mode === 'login' 
                ? (isUrdu ? 'لاگ ان کریں' : 'Patient & Staff Sign In') 
                : mode === 'signup' 
                ? (isUrdu ? 'نیا پیشنٹ اکاؤنٹ بنائیں' : 'Patient Registration') 
                : (isUrdu ? 'پاس ورڈ ری سیٹ کریں' : 'Reset Password')}
            </h3>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Instant Demo Role Switchers Box */}
        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">⚡ Instant Demo Role Portals:</div>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              type="button"
              onClick={() => handleDemoLogin('patient')}
              className="py-1.5 px-2 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[11px] font-bold hover:scale-105 transition-transform"
            >
              Patient Demo
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('doctor')}
              className="py-1.5 px-2 rounded-lg bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 text-[11px] font-bold hover:scale-105 transition-transform"
            >
              Doctor Demo
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('admin')}
              className="py-1.5 px-2 rounded-lg bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 text-[11px] font-bold hover:scale-105 transition-transform"
            >
              Admin Demo
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-50 text-red-600 text-xs font-semibold border border-red-200">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          
          {mode === 'signup' && (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name / پورا نام *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Syed Tariq Ali"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full pl-9 p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Phone Number / فون نمبر *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  <input
                    type="tel"
                    required
                    placeholder="+92 300 1234567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-9 p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Email Address / ای میل *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="email"
                required
                placeholder="patient@fatimazahra.org"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
              />
            </div>
          </div>

          {mode !== 'forgot' && (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Password / پاس ورڈ *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                  />
                </div>
              </div>

              {mode === 'signup' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Confirm Password / پاس ورڈ کی تصدیق *
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-9 p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                    />
                  </div>
                </div>
              )}
            </>
          )}

          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Account Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold"
              >
                <option value="patient">Patient (مریض)</option>
                <option value="doctor">Doctor (ڈاکٹر)</option>
                <option value="admin">Admin / Management (انتظامیہ)</option>
              </select>
            </div>
          )}

          {mode === 'login' && (
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-slate-400">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                />
                <span>Remember Me</span>
              </label>
              <button
                type="button"
                onClick={() => { setMode('forgot'); setError(null); setSuccessMsg(null); }}
                className="text-emerald-600 hover:underline font-semibold"
              >
                Forgot Password?
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all hover:scale-[1.02] mt-2 flex items-center justify-center gap-2 disabled:opacity-80"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-emerald-200" />
                <span>{isUrdu ? 'توثیق ہو رہی ہے...' : 'Authenticating...'}</span>
              </>
            ) : mode === 'login' ? (
              <span>{isUrdu ? 'لاگ ان کریں' : 'Sign In to Portal'}</span>
            ) : mode === 'signup' ? (
              <span>{isUrdu ? 'نیا اکاؤنٹ بنائیں' : 'Create Account'}</span>
            ) : (
              <span>{isUrdu ? 'ری سیٹ لنک بھیجیں' : 'Send Password Reset Email'}</span>
            )}
          </button>
        </form>

        {/* Footer Toggles */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100 dark:border-slate-800">
          {mode === 'login' ? (
            <button 
              onClick={() => { setMode('signup'); setError(null); setSuccessMsg(null); }} 
              className="hover:underline font-bold text-emerald-600"
            >
              New patient? Register Account
            </button>
          ) : (
            <button 
              onClick={() => { setMode('login'); setError(null); setSuccessMsg(null); }} 
              className="hover:underline font-bold text-emerald-600"
            >
              Already registered? Sign In
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

