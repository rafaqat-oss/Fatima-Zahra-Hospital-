import React, { useState } from 'react';
import { X, Calendar, Clock, User, Phone, CheckCircle, FileText, Stethoscope, Building } from 'lucide-react';
import { Department, Doctor, UserProfile, Appointment } from '../types';
import { initialDepartments, initialDoctors } from '../data/initialData';
import { createAppointment } from '../lib/firebase';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile | null;
  selectedDoctor?: Doctor | null;
  selectedDeptId?: string | null;
  language: 'en' | 'ur';
  onAppointmentCreated: (appt: Appointment) => void;
}

export const AppointmentModal: React.FC<AppointmentModalProps> = ({
  isOpen,
  onClose,
  user,
  selectedDoctor,
  selectedDeptId,
  language,
  onAppointmentCreated
}) => {
  const isUrdu = language === 'ur';

  const [step, setStep] = useState<number>(1);
  const [departmentId, setDepartmentId] = useState<string>(selectedDeptId || selectedDoctor?.departmentId || initialDepartments[0].id);
  const [doctorId, setDoctorId] = useState<string>(selectedDoctor?.id || initialDoctors[0].id);
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [timeSlot, setTimeSlot] = useState<string>('10:00 AM');
  
  const [patientName, setPatientName] = useState<string>(user?.displayName || '');
  const [patientPhone, setPatientPhone] = useState<string>(user?.phone || '');
  const [patientAge, setPatientAge] = useState<number>(30);
  const [notes, setNotes] = useState<string>('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedAppt, setConfirmedAppt] = useState<Appointment | null>(null);

  if (!isOpen) return null;

  const currentDept = initialDepartments.find(d => d.id === departmentId) || initialDepartments[0];
  const filteredDoctors = initialDoctors.filter(d => d.departmentId === departmentId);
  const currentDoctor = initialDoctors.find(d => d.id === doctorId) || filteredDoctors[0] || initialDoctors[0];

  const availableSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName || !patientPhone) return;

    setIsSubmitting(true);
    try {
      const apptData = {
        patientId: user?.uid || 'guest-' + Date.now(),
        patientName,
        patientPhone,
        patientAge,
        doctorId: currentDoctor.id,
        doctorName: currentDoctor.name,
        departmentId: currentDept.id,
        departmentName: currentDept.name,
        date,
        timeSlot,
        status: 'confirmed' as const,
        notes,
        fee: currentDoctor.fee
      };

      const id = await createAppointment(apptData);
      const fullAppt: Appointment = {
        ...apptData,
        id,
        createdAt: new Date().toISOString()
      };

      setConfirmedAppt(fullAppt);
      onAppointmentCreated(fullAppt);
      setStep(3); // Confirmation Step
    } catch (err) {
      console.error('Failed to create appointment:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6 my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
              {isUrdu ? 'فاطمہ زہرہ ہسپتال رانیوال سیداں' : 'Fatima Zahra Hospital Gujrat'}
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              {isUrdu ? 'اپائنٹمنٹ کی بکنگ' : 'Book Medical Appointment'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step 3: Confirmed Ticket View */}
        {confirmedAppt ? (
          <div className="space-y-6 text-center py-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle className="w-10 h-10" />
            </div>

            <div>
              <h4 className="text-2xl font-black text-slate-900 dark:text-white">
                {isUrdu ? 'اپائنٹمنٹ کی تصدیق ہو گئی!' : 'Appointment Confirmed!'}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Receipt ID: <strong className="text-emerald-600">{confirmedAppt.id}</strong>
              </p>
            </div>

            {/* Printable Ticket Box */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-left space-y-3 text-xs sm:text-sm">
              <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                <span className="text-slate-500">Patient Name:</span>
                <span className="font-bold text-slate-900 dark:text-white">{confirmedAppt.patientName}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                <span className="text-slate-500">Doctor:</span>
                <span className="font-bold text-emerald-600">{confirmedAppt.doctorName}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                <span className="text-slate-500">Department:</span>
                <span className="font-bold text-slate-900 dark:text-white">{confirmedAppt.departmentName}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                <span className="text-slate-500">Date & Time:</span>
                <span className="font-bold text-slate-900 dark:text-white">{confirmedAppt.date} at {confirmedAppt.timeSlot}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Fee / Status:</span>
                <span className="font-extrabold text-emerald-600">{confirmedAppt.fee}</span>
              </div>
            </div>

            <p className="text-xs text-slate-500">
              📍 Location: Near Fruit Mandi, Ranewal Syedan, Gujrat. Contact: +92 336 1992199
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => window.print()}
                className="w-1/2 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 font-bold text-xs flex items-center justify-center gap-1.5"
              >
                <FileText className="w-4 h-4" /> Print Ticket
              </button>
              <button
                onClick={onClose}
                className="w-1/2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
              >
                Done / بند کریں
              </button>
            </div>
          </div>
        ) : (
          /* Booking Form */
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Step 1: Doctor & Department Selection */}
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                    <Building className="w-4 h-4 text-emerald-600" />
                    <span>Select Department / شعبہ منتخب کریں</span>
                  </label>
                  <select
                    value={departmentId}
                    onChange={(e) => {
                      setDepartmentId(e.target.value);
                      const docs = initialDoctors.filter(d => d.departmentId === e.target.value);
                      if (docs.length > 0) setDoctorId(docs[0].id);
                    }}
                    className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-semibold focus:ring-2 focus:ring-emerald-500"
                  >
                    {initialDepartments.map(d => (
                      <option key={d.id} value={d.id}>{d.name} ({d.urduName})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                    <Stethoscope className="w-4 h-4 text-emerald-600" />
                    <span>Select Doctor / ڈاکٹر منتخب کریں</span>
                  </label>
                  <select
                    value={doctorId}
                    onChange={(e) => setDoctorId(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-semibold focus:ring-2 focus:ring-emerald-500"
                  >
                    {filteredDoctors.map(doc => (
                      <option key={doc.id} value={doc.id}>{doc.name} - {doc.specialization}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-emerald-600" />
                      <span>Date</span>
                    </label>
                    <input
                      type="date"
                      value={date}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                      <Clock className="w-4 h-4 text-emerald-600" />
                      <span>Time Slot</span>
                    </label>
                    <select
                      value={timeSlot}
                      onChange={(e) => setTimeSlot(e.target.value)}
                      className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold"
                    >
                      {availableSlots.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-colors"
                >
                  {isUrdu ? 'اگلا مرحلہ: مریض کی معلومات' : 'Next: Patient Info'}
                </button>
              </div>
            )}

            {/* Step 2: Patient Info */}
            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                    <User className="w-4 h-4 text-emerald-600" />
                    <span>Patient Full Name / مریض کا پورا نام *</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Muhammad Ali Shah"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                      <Phone className="w-4 h-4 text-emerald-600" />
                      <span>Phone Number *</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="0300 1234567"
                      value={patientPhone}
                      onChange={(e) => setPatientPhone(e.target.value)}
                      className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Age (عمر)
                    </label>
                    <input
                      type="number"
                      value={patientAge}
                      onChange={(e) => setPatientAge(Number(e.target.value))}
                      className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Medical Notes / Symptoms (علامات کا خلاصہ)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Briefly describe your health concern..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-1/3 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 font-bold text-xs"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-2/3 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 disabled:opacity-80"
                  >
                    {isSubmitting ? (
                      <>
                        <Clock className="w-4 h-4 animate-spin text-emerald-200" />
                        <span>{isUrdu ? 'پروسیسنگ ہو رہی ہے...' : 'Booking in Progress...'}</span>
                      </>
                    ) : (
                      <span>{isUrdu ? 'اپائنٹمنٹ مکمل کریں' : 'Confirm Appointment'}</span>
                    )}
                  </button>
                </div>
              </div>
            )}

          </form>
        )}

      </div>
    </div>
  );
};
