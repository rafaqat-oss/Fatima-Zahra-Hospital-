import React from 'react';
import { QrCode, Printer, X, ShieldCheck, Heart, User, Calendar, Phone } from 'lucide-react';
import { UserProfile } from '../types';

interface PatientQRModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  language: 'en' | 'ur';
}

export const PatientQRModal: React.FC<PatientQRModalProps> = ({ isOpen, onClose, user, language }) => {
  const isUrdu = language === 'ur';

  if (!isOpen) return null;

  // Simple clean SVG QR code simulation displaying encoded patient data
  const qrData = `FATIMA_ZAHRA_HOSPITAL|PATIENT:${user.uid}|NAME:${user.displayName}|PHONE:${user.phone || 'N/A'}`;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6 relative animate-in fade-in zoom-in-95">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Printable Card Area */}
        <div id="patient-card-print" className="p-6 rounded-3xl bg-gradient-to-br from-teal-800 via-emerald-800 to-teal-900 text-white shadow-xl space-y-5 border border-emerald-500/30">
          
          <div className="flex items-center justify-between border-b border-white/20 pb-3">
            <div>
              <div className="text-[10px] uppercase font-bold tracking-widest text-teal-200">
                Fatima Zahra Hospital
              </div>
              <div className="text-xs font-semibold text-emerald-100">
                Ranewal Syedan, Gujrat
              </div>
            </div>
            <Heart className="w-5 h-5 text-red-400 fill-red-400" />
          </div>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl font-black text-white border border-white/30">
              {user.displayName.charAt(0)}
            </div>
            <div className="space-y-1">
              <h3 className="font-extrabold text-lg text-white">{user.displayName}</h3>
              <p className="text-xs text-teal-100 flex items-center gap-1">
                <User className="w-3.5 h-3.5" /> ID: <span className="font-mono text-white font-bold">{user.uid.slice(0, 10)}</span>
              </p>
              <p className="text-xs text-teal-100 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5" /> {user.phone || '+92 336 1992199'}
              </p>
            </div>
          </div>

          {/* QR Code Container */}
          <div className="bg-white p-4 rounded-2xl text-slate-900 flex flex-col items-center justify-center space-y-2">
            <div className="w-32 h-32 bg-slate-900 p-2 rounded-xl flex items-center justify-center relative">
              {/* Simulated QR Code matrix visual */}
              <div className="grid grid-cols-5 gap-1.5 w-full h-full p-1 bg-white rounded-lg">
                <div className="bg-slate-900 rounded-xs"></div>
                <div className="bg-slate-900 rounded-xs"></div>
                <div className="bg-white"></div>
                <div className="bg-slate-900 rounded-xs"></div>
                <div className="bg-slate-900 rounded-xs"></div>
                <div className="bg-slate-900 rounded-xs"></div>
                <div className="bg-white"></div>
                <div className="bg-slate-900 rounded-xs"></div>
                <div className="bg-white"></div>
                <div className="bg-slate-900 rounded-xs"></div>
                <div className="bg-white"></div>
                <div className="bg-slate-900 rounded-xs"></div>
                <div className="bg-slate-900 rounded-xs"></div>
                <div className="bg-slate-900 rounded-xs"></div>
                <div className="bg-white"></div>
                <div className="bg-slate-900 rounded-xs"></div>
                <div className="bg-white"></div>
                <div className="bg-slate-900 rounded-xs"></div>
                <div className="bg-white"></div>
                <div className="bg-slate-900 rounded-xs"></div>
                <div className="bg-slate-900 rounded-xs"></div>
                <div className="bg-slate-900 rounded-xs"></div>
                <div className="bg-white"></div>
                <div className="bg-slate-900 rounded-xs"></div>
                <div className="bg-slate-900 rounded-xs"></div>
              </div>
            </div>
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">
              Scan at OPD Reception Desk
            </span>
          </div>

          <div className="text-[10px] text-teal-200 text-center font-medium">
            Emergency Hotline: +92 336 1992199 • Near Fruit Mandi
          </div>
        </div>

        <button
          onClick={() => window.print()}
          className="w-full py-3 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
        >
          <Printer className="w-4 h-4" />
          <span>Print Patient Card</span>
        </button>

      </div>
    </div>
  );
};
