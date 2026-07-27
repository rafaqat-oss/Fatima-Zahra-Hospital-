import React, { useState } from 'react';
import { Droplet, HeartHandshake, CheckCircle, X, AlertTriangle } from 'lucide-react';
import { BloodGroupStock } from '../types';
import { initialBloodBank } from '../data/initialData';

interface BloodBankModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'en' | 'ur';
}

export const BloodBankModal: React.FC<BloodBankModalProps> = ({ isOpen, onClose, language }) => {
  const isUrdu = language === 'ur';
  const [bloodStock] = useState<BloodGroupStock[]>(initialBloodBank);
  const [requestSubmitted, setRequestSubmitted] = useState(false);
  const [requestedGroup, setRequestedGroup] = useState('O+');
  const [patientName, setPatientName] = useState('');
  const [phone, setPhone] = useState('+92 ');

  if (!isOpen) return null;

  const handleBloodRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim() || !phone.trim()) return;
    setRequestSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6 relative animate-in fade-in zoom-in-95 my-8">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-3 bg-red-100 dark:bg-red-950/60 rounded-2xl text-red-600 dark:text-red-400 shrink-0">
            <Droplet className="w-6 h-6 fill-red-600" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              {isUrdu ? 'بلڈ بینک و ڈونر ڈائریکٹری' : 'Blood Bank & Donor Information'}
            </h2>
            <p className="text-xs text-slate-500">
              {isUrdu ? 'فاطمہ زہرہ ہسپتال رانیوال سیداں گجرات' : 'Fatima Zahra Hospital Voluntary Blood Donation & Reserve'}
            </p>
          </div>
        </div>

        {requestSubmitted ? (
          <div className="p-6 bg-emerald-50 dark:bg-emerald-950/40 rounded-3xl border border-emerald-200 dark:border-emerald-800 text-center space-y-3">
            <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto" />
            <h3 className="text-lg font-bold text-emerald-900 dark:text-emerald-100">
              Urgent Blood Request Registered ({requestedGroup})
            </h3>
            <p className="text-xs text-emerald-700 dark:text-emerald-300">
              Our Blood Bank coordinator will immediately verify reserve bags or contact registered donors in Gujrat / Ranewal Syedan.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md"
            >
              Close
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* Blood Stock Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {bloodStock.map((b) => (
                <div
                  key={b.group}
                  className={`p-3.5 rounded-2xl border text-center space-y-1 ${b.status === 'available' ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/50' : b.status === 'low' ? 'bg-amber-50/60 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/50' : 'bg-red-50/60 dark:bg-red-950/30 border-red-200 dark:border-red-900/50'}`}
                >
                  <div className="text-xl font-black text-slate-900 dark:text-white flex items-center justify-center gap-1">
                    <Droplet className="w-4 h-4 text-red-600 fill-red-600" />
                    <span>{b.group}</span>
                  </div>
                  <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {b.bags} Bags
                  </div>
                  <div className={`text-[10px] font-extrabold uppercase ${b.status === 'available' ? 'text-emerald-600' : b.status === 'low' ? 'text-amber-600' : 'text-red-600'}`}>
                    {b.status}
                  </div>
                </div>
              ))}
            </div>

            {/* Request Form */}
            <form onSubmit={handleBloodRequest} className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="font-extrabold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <span>Urgent Blood Requirement Form</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Patient Name"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                />
                <input
                  type="text"
                  required
                  placeholder="Phone Number (+92 ...)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                />
                <select
                  value={requestedGroup}
                  onChange={(e) => setRequestedGroup(e.target.value)}
                  className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                >
                  <option value="A+">Blood Group A+</option>
                  <option value="B+">Blood Group B+</option>
                  <option value="O+">Blood Group O+</option>
                  <option value="AB+">Blood Group AB+</option>
                  <option value="A-">Blood Group A-</option>
                  <option value="B-">Blood Group B-</option>
                  <option value="O-">Blood Group O-</option>
                  <option value="AB-">Blood Group AB-</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-colors"
              >
                Submit Blood Request
              </button>
            </form>

          </div>
        )}

      </div>
    </div>
  );
};
