import React, { useState } from 'react';
import { Truck, Phone, MapPin, X, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { AmbulanceBooking } from '../types';

interface AmbulanceBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'en' | 'ur';
}

export const AmbulanceBookingModal: React.FC<AmbulanceBookingModalProps> = ({ isOpen, onClose, language }) => {
  const isUrdu = language === 'ur';
  const [patientName, setPatientName] = useState('');
  const [phone, setPhone] = useState('+92 ');
  const [pickupAddress, setPickupAddress] = useState('Ranewal Syedan, Gujrat');
  const [urgency, setUrgency] = useState<'critical' | 'urgent' | 'routine'>('critical');
  const [booking, setBooking] = useState<AmbulanceBooking | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim() || !phone.trim() || !pickupAddress.trim()) return;

    const newBooking: AmbulanceBooking = {
      id: 'AMB-' + Math.floor(1000 + Math.random() * 9000),
      patientName,
      phone,
      pickupAddress,
      urgency,
      status: 'dispatched',
      driverName: 'Chaudhry Tariq Mehmood (Emergency Ambulance)',
      eta: '8 to 12 Minutes'
    };

    setBooking(newBooking);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6 relative animate-in fade-in zoom-in-95">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-3 bg-red-100 dark:bg-red-950/60 rounded-2xl text-red-600 dark:text-red-400 shrink-0">
            <Truck className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              {isUrdu ? '24/7 ایمرجنسی ایمبولینس بکنگ' : '24/7 Emergency Ambulance Service'}
            </h2>
            <p className="text-xs text-slate-500">
              {isUrdu ? 'فاطمہ زہرہ ہسپتال رانیوال سیداں، گجرات' : 'Fatima Zahra Hospital • Ranewal Syedan, Gujrat'}
            </p>
          </div>
        </div>

        {booking ? (
          <div className="space-y-5 text-center">
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800 space-y-2">
              <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="text-lg font-black text-emerald-900 dark:text-emerald-100">
                {isUrdu ? 'ایمبولینس روانہ کر دی گئی ہے!' : 'Ambulance Dispatched!'}
              </h3>
              <p className="text-xs text-emerald-700 dark:text-emerald-300">
                {isUrdu ? 'ڈرائیور جلد از جلد فراہم کردہ پتے پر پہنچ رہا ہے۔' : 'Emergency driver is en route to your specified address.'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 text-left text-xs space-y-2 font-medium">
              <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-1.5">
                <span className="text-slate-500">Dispatch Booking ID:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{booking.id}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-1.5">
                <span className="text-slate-500">Patient Name:</span>
                <span className="font-bold text-slate-900 dark:text-white">{booking.patientName}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-1.5">
                <span className="text-slate-500">Assigned Driver:</span>
                <span className="font-bold text-emerald-600">{booking.driverName}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-1.5">
                <span className="text-slate-500">Estimated Arrival (ETA):</span>
                <span className="font-bold text-red-600 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {booking.eta}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Pickup Location:</span>
                <span className="font-bold text-slate-900 dark:text-white">{booking.pickupAddress}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-200 text-xs flex items-center gap-2">
              <Phone className="w-4 h-4 shrink-0" />
              <span>Direct Emergency Helpline: <strong>+92 336 1992199</strong></span>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 bg-slate-900 dark:bg-slate-100 dark:text-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800 transition-colors"
            >
              {isUrdu ? 'بند کریں' : 'Close Details'}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="p-3 bg-red-50 dark:bg-red-950/30 rounded-2xl border border-red-200 dark:border-red-900/40 text-xs text-red-800 dark:text-red-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{isUrdu ? 'برائے مہربانی ایمرجنسی میں فوری رابطہ کے لیے صحیح فون نمبر درج کریں۔' : 'For acute emergencies, you can also directly dial +92 336 1992199.'}</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {isUrdu ? 'مریض کا نام' : 'Patient Name'}
              </label>
              <input
                type="text"
                required
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder="e.g. Muhammad Yousaf"
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {isUrdu ? 'رابطہ نمبر' : 'Phone Number'}
                </label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {isUrdu ? 'نوعیت ایمرجنسی' : 'Urgency Level'}
                </label>
                <select
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value as any)}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="critical">🚨 Critical / Oxygen / Trauma</option>
                  <option value="urgent">⚠️ Urgent Patient Transport</option>
                  <option value="routine">🚑 Non-Emergency Transfer</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {isUrdu ? 'پتا / موقوفہ جگہ' : 'Pickup Address'}
              </label>
              <textarea
                rows={2}
                required
                value={pickupAddress}
                onChange={(e) => setPickupAddress(e.target.value)}
                placeholder="e.g. Near Fruit Mandi / Main Bazaar Ranewal Syedan Gujrat"
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2"
            >
              <Truck className="w-4 h-4" />
              <span>{isUrdu ? 'ایمبولینس ابھی روانہ کریں' : 'Dispatch Emergency Ambulance'}</span>
            </button>

          </form>
        )}

      </div>
    </div>
  );
};
