import React, { useState } from 'react';
import { Pill, Search, CheckCircle, X, ShoppingBag, Heart } from 'lucide-react';
import { MedicineItem } from '../types';
import { initialPharmacy } from '../data/initialData';

interface PharmacyDispensaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'en' | 'ur';
}

export const PharmacyDispensaryModal: React.FC<PharmacyDispensaryModalProps> = ({ isOpen, onClose, language }) => {
  const isUrdu = language === 'ur';
  const [search, setSearch] = useState('');
  const [medicines] = useState<MedicineItem[]>(initialPharmacy);
  const [requestedMed, setRequestedMed] = useState<MedicineItem | null>(null);

  if (!isOpen) return null;

  const filtered = medicines.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.formula.toLowerCase().includes(search.toLowerCase()) ||
    m.category.toLowerCase().includes(search.toLowerCase())
  );

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
          <div className="p-3 bg-emerald-100 dark:bg-emerald-950/60 rounded-2xl text-emerald-700 dark:text-emerald-300 shrink-0">
            <Pill className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              {isUrdu ? 'سبسیڈائزڈ ادویات و فارمیسی' : 'Subsidized Pharmacy & Dispensary'}
            </h2>
            <p className="text-xs text-slate-500">
              {isUrdu ? 'فاطمہ زہرہ ہسپتال مفت و رعایتی ڈسپنسری' : 'Fatima Zahra Hospital Welfare Medicine Inventory'}
            </p>
          </div>
        </div>

        {requestedMed ? (
          <div className="p-6 bg-emerald-50 dark:bg-emerald-950/40 rounded-3xl border border-emerald-200 dark:border-emerald-800 text-center space-y-3">
            <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto" />
            <h3 className="text-lg font-bold text-emerald-900 dark:text-emerald-100">
              {requestedMed.name} Reservation Saved
            </h3>
            <p className="text-xs text-emerald-700 dark:text-emerald-300">
              Please present your doctor prescription at Fatima Zahra Hospital Pharmacy Counter in Ranewal Syedan to collect your medicine.
            </p>
            <button
              onClick={() => setRequestedMed(null)}
              className="px-5 py-2 bg-emerald-700 text-white font-bold text-xs rounded-xl"
            >
              Back to Medicine Catalog
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder={isUrdu ? 'دوا یا فارمولا کا نام تلاش کریں...' : 'Search medicine name, formula, or category...'}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Catalog Grid */}
            <div className="max-h-80 overflow-y-auto space-y-3 pr-1">
              {filtered.map((med) => (
                <div
                  key={med.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3 hover:border-emerald-500/50 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                      <span>{med.name}</span>
                      {med.isWelfareFree && (
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Heart className="w-3 h-3 text-emerald-600 fill-emerald-600" /> Free Welfare
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500 font-mono">
                      Formula: {med.formula} • {med.category}
                    </div>
                  </div>

                  <div className="text-right shrink-0 space-y-1">
                    <div className="text-xs font-black text-emerald-600">{med.price}</div>
                    <button
                      onClick={() => setRequestedMed(med)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] shadow-xs flex items-center gap-1 ml-auto"
                    >
                      <ShoppingBag className="w-3 h-3" /> Reserve
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
