import React, { useState } from 'react';
import { BedDouble, CheckCircle, Clock, X, ShieldAlert, HeartHandshake } from 'lucide-react';
import { BedCategory } from '../types';
import { initialBeds } from '../data/initialData';

interface BedAvailabilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'en' | 'ur';
}

export const BedAvailabilityModal: React.FC<BedAvailabilityModalProps> = ({ isOpen, onClose, language }) => {
  const isUrdu = language === 'ur';
  const [beds, setBeds] = useState<BedCategory[]>(initialBeds);
  const [selectedWard, setSelectedWard] = useState<string | null>(null);
  const [patientName, setPatientName] = useState('');
  const [phone, setPhone] = useState('+92 ');
  const [requested, setRequested] = useState(false);

  if (!isOpen) return null;

  const handleRequestAdmission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim() || !phone.trim() || !selectedWard) return;

    setBeds(prev => prev.map(b => b.id === selectedWard ? { ...b, availableBeds: Math.max(0, b.availableBeds - 1) } : b));
    setRequested(true);
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
          <div className="p-3 bg-teal-100 dark:bg-teal-950/60 rounded-2xl text-teal-700 dark:text-teal-300 shrink-0">
            <BedDouble className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              {isUrdu ? 'آئی سی یو و بیڈز دستیابی' : 'ICU & Inpatient Bed Availability'}
            </h2>
            <p className="text-xs text-slate-500">
              {isUrdu ? 'فاطمہ زہرہ ہسپتال رانیوال سیداں گجرات' : 'Real-time bed tracking for Male, Female & Maternity Wards'}
            </p>
          </div>
        </div>

        {requested ? (
          <div className="p-6 bg-emerald-50 dark:bg-emerald-950/40 rounded-3xl border border-emerald-200 dark:border-emerald-800 text-center space-y-3">
            <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto" />
            <h3 className="text-lg font-black text-emerald-900 dark:text-emerald-100">
              {isUrdu ? 'بیڈ ایڈمیشن کی درخواست درج ہو گئی ہے!' : 'Bed Admission Request Submitted!'}
            </h3>
            <p className="text-xs text-emerald-700 dark:text-emerald-300">
              {isUrdu ? 'ہسپتال ریسیپشن آپ سے فوراً رابطہ کر کے بیڈ الاٹمنٹ مکمل کرے گا۔' : 'Hospital admin will confirm your bed reservation shortly. Please call +92 336 1992199 for urgent inquiries.'}
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
            
            <div className="grid grid-cols-1 gap-3">
              {beds.map((b) => (
                <div
                  key={b.id}
                  onClick={() => setSelectedWard(b.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 ${selectedWard === b.id ? 'border-teal-500 bg-teal-50/80 dark:bg-teal-950/40 shadow-sm' : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100'}`}
                >
                  <div className="space-y-1">
                    <div className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                      <span>{isUrdu ? b.urduName : b.wardName}</span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200 px-2 py-0.5 rounded-md font-semibold">
                        {b.dailyCharge}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500">{b.location}</div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right">
                      <span className={`text-sm font-black ${b.availableBeds > 3 ? 'text-emerald-600' : 'text-amber-600'}`}>
                        {b.availableBeds} Available
                      </span>
                      <span className="text-xs text-slate-400 block font-mono">/ {b.totalBeds} Total</span>
                    </div>

                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedWard === b.id ? 'border-teal-600 bg-teal-600' : 'border-slate-300'}`}>
                      {selectedWard === b.id && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {selectedWard && (
              <form onSubmit={handleRequestAdmission} className="p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl space-y-3">
                <div className="font-bold text-xs text-slate-800 dark:text-slate-200">
                  Request Bed Allocation for Ward
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Patient Full Name"
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
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
                >
                  Reserve Bed / Submit Request
                </button>
              </form>
            )}

          </div>
        )}

      </div>
    </div>
  );
};
