import React, { useState } from 'react';
import { X, User, Lock, Mail, Phone, ShieldCheck, AlertTriangle, KeyRound, Trash2, CheckCircle2, RefreshCw } from 'lucide-react';
import { auth, updateUserProfileData, changeUserPassword, triggerEmailVerification, deleteUserAccount } from '../lib/firebase';
import { UserProfile } from '../types';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onProfileUpdated: (updatedProfile: UserProfile) => void;
  onAccountDeleted: () => void;
  language: 'en' | 'ur';
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  onProfileUpdated,
  onAccountDeleted,
  language
}) => {
  const isUrdu = language === 'ur';

  const [activeTab, setActiveTab] = useState<'profile' | 'password' | 'verification' | 'danger'>('profile');

  // Profile Fields
  const [displayName, setDisplayName] = useState(user.displayName || '');
  const [phone, setPhone] = useState(user.phone || '');

  // Password Fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  // Delete Account Password
  const [deletePassword, setDeletePassword] = useState('');

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const isEmailVerified = auth.currentUser?.emailVerified || user.uid.startsWith('demo-');

  // Handle Update Profile
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      await updateUserProfileData(user.uid, { displayName, phone });
      const updated: UserProfile = { ...user, displayName, phone };
      onProfileUpdated(updated);
      setSuccess(isUrdu ? 'پروفائل کامیابی کے ساتھ اپ ڈیٹ ہو گئی!' : 'Profile updated successfully!');
    } catch (err: any) {
      console.error('Update profile error:', err);
      setError(err?.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Change Password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (newPassword !== confirmNewPassword) {
      setError(isUrdu ? 'نئے پاس ورڈ آپس میں نہیں ملتے۔' : 'New passwords do not match.');
      return;
    }
    if (newPassword.length < 6) {
      setError(isUrdu ? 'پاس ورڈ کم از کم 6 ہندسوں کا ہونا چاہیے۔' : 'Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    try {
      await changeUserPassword(currentPassword, newPassword);
      setSuccess(isUrdu ? 'پاس ورڈ کامیابی کے ساتھ تبدیل کر دیا گیا ہے!' : 'Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err: any) {
      console.error('Change password error:', err);
      setError(err?.message || 'Failed to change password. Please check your current password.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Resend Email Verification
  const handleResendVerification = async () => {
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      await triggerEmailVerification();
      setSuccess(isUrdu ? 'تصدیقی ای میل بھیج دی گئی ہے۔ اپنا انباکس چیک کریں۔' : 'Verification email sent successfully! Please check your inbox.');
    } catch (err: any) {
      console.error('Verification error:', err);
      setError(err?.message || 'Failed to send verification email.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Delete Account
  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirm(isUrdu ? 'کیا آپ واقعی اپنا اکاؤنٹ مستقل طور پر ختم کرنا چاہتے ہیں؟' : 'Are you sure you want to permanently delete your account? This action cannot be undone.')) {
      return;
    }

    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      await deleteUserAccount(user.uid, deletePassword);
      onAccountDeleted();
      onClose();
    } catch (err: any) {
      console.error('Delete account error:', err);
      setError(err?.message || 'Failed to delete account. Please re-authenticate.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6 my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
              {isUrdu ? 'اکاؤنٹ سیٹنگز' : 'Account & Security Settings'}
            </div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <User className="w-5 h-5 text-emerald-600" />
              <span>{user.displayName || 'User Profile'}</span>
            </h3>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 gap-2 overflow-x-auto">
          <button
            onClick={() => { setActiveTab('profile'); setError(null); setSuccess(null); }}
            className={`pb-3 px-3 text-xs font-bold flex items-center gap-1.5 border-b-2 transition-colors whitespace-nowrap ${activeTab === 'profile' ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
          >
            <User className="w-3.5 h-3.5" />
            <span>{isUrdu ? 'پروفائل تبدیل کریں' : 'Update Profile'}</span>
          </button>

          <button
            onClick={() => { setActiveTab('password'); setError(null); setSuccess(null); }}
            className={`pb-3 px-3 text-xs font-bold flex items-center gap-1.5 border-b-2 transition-colors whitespace-nowrap ${activeTab === 'password' ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>{isUrdu ? 'پاس ورڈ تبدیل کریں' : 'Change Password'}</span>
          </button>

          <button
            onClick={() => { setActiveTab('verification'); setError(null); setSuccess(null); }}
            className={`pb-3 px-3 text-xs font-bold flex items-center gap-1.5 border-b-2 transition-colors whitespace-nowrap ${activeTab === 'verification' ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>{isUrdu ? 'ای میل تصدیق' : 'Email Verification'}</span>
          </button>

          <button
            onClick={() => { setActiveTab('danger'); setError(null); setSuccess(null); }}
            className={`pb-3 px-3 text-xs font-bold flex items-center gap-1.5 border-b-2 transition-colors whitespace-nowrap ${activeTab === 'danger' ? 'border-red-600 text-red-600' : 'border-transparent text-slate-500 hover:text-red-600'}`}
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{isUrdu ? 'اکاؤنٹ ڈیلیٹ کریں' : 'Delete Account'}</span>
          </button>
        </div>

        {/* Feedback banners */}
        {error && (
          <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs font-semibold border border-red-200">
            {error}
          </div>
        )}
        {success && (
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* TAB 1: UPDATE PROFILE */}
        {activeTab === 'profile' && (
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Full Name / پورا نام
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full pl-9 p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Phone Number / فون نمبر
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="text"
                  placeholder="+92 300 1234567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-9 p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Email Address (Read-only)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="email"
                  disabled
                  value={user.email}
                  className="w-full pl-9 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/50 text-slate-500 text-xs cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                User Role
              </label>
              <span className="inline-block px-3 py-1 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
                {user.role}
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-colors"
            >
              {loading ? 'Saving Changes...' : 'Save Profile Changes'}
            </button>
          </form>
        )}

        {/* TAB 2: CHANGE PASSWORD */}
        {activeTab === 'password' && (
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Current Password / موجودہ پاس ورڈ
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full pl-9 p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                New Password / نیا پاس ورڈ
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pl-9 p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Confirm New Password / نئے پاس ورڈ کی تصدیق
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className="w-full pl-9 p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-colors"
            >
              {loading ? 'Updating Password...' : 'Update Password'}
            </button>
          </form>
        )}

        {/* TAB 3: EMAIL VERIFICATION */}
        {activeTab === 'verification' && (
          <div className="space-y-4 text-center py-2">
            <div className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center ${isEmailVerified ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
              <ShieldCheck className="w-8 h-8" />
            </div>

            <div>
              <h4 className="font-extrabold text-base text-slate-900 dark:text-white">
                {isEmailVerified ? 'Email Address Verified' : 'Email Verification Pending'}
              </h4>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                {isEmailVerified
                  ? `Your registered email (${user.email}) is verified and secure.`
                  : `Please verify your email address (${user.email}) to receive instant appointment alerts and digital prescriptions.`}
              </p>
            </div>

            {!isEmailVerified && (
              <button
                type="button"
                onClick={handleResendVerification}
                disabled={loading}
                className="px-6 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md inline-flex items-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span>Resend Verification Email</span>
              </button>
            )}
          </div>
        )}

        {/* TAB 4: DELETE ACCOUNT */}
        {activeTab === 'danger' && (
          <form onSubmit={handleDeleteAccount} className="space-y-4 p-4 rounded-2xl bg-red-50/50 dark:bg-red-950/20 border border-red-200 dark:border-red-900">
            <div className="flex items-start gap-3 text-red-700 dark:text-red-400">
              <AlertTriangle className="w-6 h-6 shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-extrabold block text-sm">Delete Account Permanently</span>
                Deleting your account will purge your patient records, appointments history, and authentication details from Fatima Zahra Hospital system.
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Enter Password to Confirm Deletion
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                className="w-full p-3 rounded-xl border border-red-300 dark:border-red-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md transition-colors"
            >
              {loading ? 'Deleting Account...' : 'Permanently Delete My Account'}
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
