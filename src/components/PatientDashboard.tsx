import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, FileText, CheckCircle, AlertCircle, Phone, Heart, Plus, QrCode, Pill, Video, Shield, Bell, CheckSquare, Square, Download, Activity } from 'lucide-react';
import { Appointment, UserProfile, Prescription, LabReport, MedicineReminder } from '../types';
import { fetchAppointments, updateAppointmentStatus } from '../lib/firebase';
import { initialPrescriptions, initialLabReports, initialReminders } from '../data/initialData';
import { PatientQRModal } from './PatientQRModal';
import { TelehealthVideoModal } from './TelehealthVideoModal';

interface PatientDashboardProps {
  user: UserProfile;
  language: 'en' | 'ur';
  onNewAppointment: () => void;
}

export const PatientDashboard: React.FC<PatientDashboardProps> = ({
  user,
  language,
  onNewAppointment
}) => {
  const isUrdu = language === 'ur';
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'appointments' | 'prescriptions' | 'labs' | 'reminders'>('appointments');
  
  const [prescriptions] = useState<Prescription[]>(initialPrescriptions);
  const [labReports] = useState<LabReport[]>(initialLabReports);
  const [reminders, setReminders] = useState<MedicineReminder[]>(initialReminders);
  
  const [showQRModal, setShowQRModal] = useState(false);
  const [selectedVideoAppt, setSelectedVideoAppt] = useState<Appointment | null>(null);

  useEffect(() => {
    loadPatientAppointments();
  }, [user]);

  const loadPatientAppointments = async () => {
    setLoading(true);
    const data = await fetchAppointments('patient', user.uid);
    setAppointments(data);
    setLoading(false);
  };

  const handleCancel = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this appointment?')) return;
    await updateAppointmentStatus(id, 'cancelled');
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'cancelled' } : a));
  };

  const toggleReminder = (id: string) => {
    setReminders(prev => prev.map(r => r.id === id ? { ...r, takenToday: !r.takenToday } : r));
  };

  return (
    <div className="py-10 bg-slate-50 dark:bg-slate-950/60 min-h-[70vh] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Welcome Header */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-700 to-teal-800 text-white shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="text-xs uppercase font-bold tracking-wider text-emerald-200">Patient Portal • فاطمہ زہرہ ہسپتال</div>
            <h1 className="text-2xl sm:text-3xl font-black">{user.displayName || 'Patient'}</h1>
            <p className="text-xs sm:text-sm text-emerald-100 mt-1">
              {isUrdu ? 'آپ کے تمام اپائنٹمنٹس، ٹیسٹ رپورٹس اور میڈیکل ریکارڈ کی تفصیلات' : 'View your scheduled consultations, digital prescriptions, lab reports & reminders.'}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 shrink-0">
            <button
              onClick={() => setShowQRModal(true)}
              className="px-4 py-3 rounded-2xl bg-emerald-900/60 hover:bg-emerald-900 text-white border border-emerald-500/40 font-bold text-xs shadow-md flex items-center gap-2 transition-colors"
            >
              <QrCode className="w-4 h-4 text-emerald-300" />
              <span>{isUrdu ? 'پیشنٹ کیو آر کارڈ' : 'Patient ID Card'}</span>
            </button>

            <button
              onClick={onNewAppointment}
              className="px-5 py-3 rounded-2xl bg-white text-emerald-800 font-bold text-xs shadow-md flex items-center gap-2 hover:bg-emerald-50 transition-colors"
            >
              <Plus className="w-4 h-4 text-emerald-600" />
              <span>{isUrdu ? 'نئی اپائنٹمنٹ لیں' : 'Book Appointment'}</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 overflow-x-auto gap-2">
          <button
            onClick={() => setActiveTab('appointments')}
            className={`pb-3 px-4 text-xs font-extrabold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${activeTab === 'appointments' ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
          >
            <Calendar className="w-4 h-4" />
            <span>{isUrdu ? 'اپائنٹمنٹس' : 'Appointments'}</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px]">{appointments.length}</span>
          </button>

          <button
            onClick={() => setActiveTab('prescriptions')}
            className={`pb-3 px-4 text-xs font-extrabold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${activeTab === 'prescriptions' ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
          >
            <FileText className="w-4 h-4" />
            <span>{isUrdu ? 'میڈیکل نسخے' : 'Digital Prescriptions'}</span>
            <span className="px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 text-[10px]">{prescriptions.length}</span>
          </button>

          <button
            onClick={() => setActiveTab('labs')}
            className={`pb-3 px-4 text-xs font-extrabold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${activeTab === 'labs' ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
          >
            <Activity className="w-4 h-4" />
            <span>{isUrdu ? 'لیب رپورٹس' : 'Lab Reports'}</span>
            <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px]">{labReports.length}</span>
          </button>

          <button
            onClick={() => setActiveTab('reminders')}
            className={`pb-3 px-4 text-xs font-extrabold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${activeTab === 'reminders' ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
          >
            <Bell className="w-4 h-4" />
            <span>{isUrdu ? 'ادویات و ویکسین ریمائنڈر' : 'Reminders'}</span>
            <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px]">{reminders.length}</span>
          </button>
        </div>

        {/* TAB 1: Appointments List */}
        {activeTab === 'appointments' && (
          <div className="space-y-4">
            {loading ? (
              <div className="p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
                  <Clock className="w-6 h-6 animate-spin" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-extrabold text-sm text-slate-800 dark:text-slate-200">
                    {isUrdu ? 'آپ کی اپائنٹمنٹس کا ریکارڈ لوڈ ہو رہا ہے...' : 'Fetching Patient Medical Records & Appointments...'}
                  </h4>
                  <p className="text-xs text-slate-500">Connecting securely to Fatima Zahra Firestore Database...</p>
                </div>
                <div className="w-48 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full mx-auto overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full animate-pulse w-3/4"></div>
                </div>
              </div>
            ) : appointments.length === 0 ? (
              <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-3">
                <Heart className="w-12 h-12 text-slate-300 mx-auto" />
                <div className="font-bold text-slate-700 dark:text-slate-300">No appointments booked yet</div>
                <p className="text-xs text-slate-500">Book your first consultation with doctors at Fatima Zahra Hospital Ranewal Syedan.</p>
                <button
                  onClick={onNewAppointment}
                  className="px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-sm"
                >
                  Book Appointment Now
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {appointments.map((appt) => (
                  <div
                    key={appt.id}
                    className="rounded-3xl bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      
                      {/* Status Badge */}
                      <div className="flex items-center justify-between">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${appt.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' : appt.status === 'completed' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'}`}>
                          {appt.status}
                        </span>
                        <span className="text-[11px] font-mono text-slate-400">#{appt.id}</span>
                      </div>

                      <div>
                        <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
                          {appt.doctorName}
                        </h3>
                        <div className="text-xs text-emerald-600 font-semibold">
                          {appt.departmentName}
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs space-y-1">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Date & Time:</span>
                          <span className="font-bold text-slate-900 dark:text-white">{appt.date} ({appt.timeSlot})</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Consultation Fee:</span>
                          <span className="font-bold text-emerald-600">{appt.fee}</span>
                        </div>
                      </div>

                      {appt.notes && (
                        <div className="text-xs text-slate-600 dark:text-slate-300 italic bg-amber-50 dark:bg-amber-950/40 p-2.5 rounded-lg border border-amber-200 dark:border-amber-800">
                          "{appt.notes}"
                        </div>
                      )}
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-2">
                      <button
                        onClick={() => setSelectedVideoAppt(appt)}
                        className="flex-1 py-2 rounded-xl bg-teal-600 text-white text-xs font-bold hover:bg-teal-700 flex items-center justify-center gap-1.5 shadow-xs"
                      >
                        <Video className="w-3.5 h-3.5" /> Video Call
                      </button>

                      {appt.status === 'confirmed' && (
                        <button
                          onClick={() => handleCancel(appt.id)}
                          className="px-3 py-2 rounded-xl bg-red-50 text-red-600 text-xs font-bold hover:bg-red-100"
                        >
                          Cancel
                        </button>
                      )}
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Prescriptions */}
        {activeTab === 'prescriptions' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {prescriptions.map((rx) => (
                <div key={rx.id} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                  <div className="flex justify-between items-start border-b border-slate-100 dark:border-slate-800 pb-3">
                    <div>
                      <div className="text-[10px] font-mono text-teal-600 font-bold">{rx.id}</div>
                      <h3 className="font-extrabold text-base text-slate-900 dark:text-white">{rx.doctorName}</h3>
                      <p className="text-xs text-slate-500">Issued Date: {rx.date}</p>
                    </div>
                    <button onClick={() => window.print()} className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600">
                      <FileText className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-2xl text-xs space-y-1">
                    <span className="text-slate-500 font-semibold block">Diagnosis:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{rx.diagnosis}</span>
                  </div>

                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Prescribed Medicines:</span>
                    <div className="space-y-1.5">
                      {rx.medicines.map((m, idx) => (
                        <div key={idx} className="p-2.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 text-xs flex justify-between items-center">
                          <div>
                            <span className="font-extrabold text-emerald-900 dark:text-emerald-200 block">{m.name}</span>
                            <span className="text-[11px] text-slate-500">{m.dosage} • {m.frequency}</span>
                          </div>
                          <span className="text-[10px] font-mono bg-emerald-200 text-emerald-900 dark:bg-emerald-900 dark:text-emerald-100 px-2 py-0.5 rounded-md font-bold">
                            {m.duration}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {rx.advice && (
                    <div className="text-xs text-slate-600 dark:text-slate-400 italic bg-amber-50 dark:bg-amber-950/30 p-2.5 rounded-xl">
                      Advice: "{rx.advice}"
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: Lab Reports */}
        {activeTab === 'labs' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {labReports.map((lab) => (
              <div key={lab.id} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex justify-between items-start border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold uppercase">{lab.category}</span>
                    <h3 className="font-extrabold text-base text-slate-900 dark:text-white mt-1">{lab.testName}</h3>
                    <p className="text-xs text-slate-500">Doctor: {lab.doctorName} • {lab.date}</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                    READY
                  </span>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-2xl text-xs space-y-1">
                  <span className="text-slate-500 font-bold block">AI Diagnostic Summary:</span>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{lab.summary}</p>
                </div>

                <button
                  onClick={() => alert(`Downloading official stamped lab report PDF for ${lab.testName}...`)}
                  className="w-full py-2.5 bg-slate-900 dark:bg-slate-100 dark:text-slate-900 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors"
                >
                  <Download className="w-4 h-4" /> Download Official PDF Report
                </button>
              </div>
            ))}
          </div>
        )}

        {/* TAB 4: Reminders */}
        {activeTab === 'reminders' && (
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 max-w-2xl mx-auto">
            <div>
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                <Bell className="w-5 h-5 text-purple-600" />
                <span>Daily Medicine & Vaccination Tracker</span>
              </h3>
              <p className="text-xs text-slate-500">Track doses and childhood vaccination schedules</p>
            </div>

            <div className="space-y-3">
              {reminders.map((r) => (
                <div
                  key={r.id}
                  onClick={() => toggleReminder(r.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${r.takenToday ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-300' : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700'}`}
                >
                  <div className="flex items-center gap-3">
                    <button className="text-emerald-600">
                      {r.takenToday ? <CheckSquare className="w-6 h-6" /> : <Square className="w-6 h-6 text-slate-400" />}
                    </button>
                    <div>
                      <span className={`font-bold text-sm block ${r.takenToday ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'}`}>
                        {r.medicineName}
                      </span>
                      <span className="text-xs text-slate-500">{r.dosage}</span>
                    </div>
                  </div>

                  <span className="px-3 py-1 rounded-xl bg-slate-200 dark:bg-slate-700 text-xs font-mono font-bold text-slate-800 dark:text-slate-200">
                    {r.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modals */}
        <PatientQRModal
          isOpen={showQRModal}
          onClose={() => setShowQRModal(false)}
          user={user}
          language={language}
        />

        <TelehealthVideoModal
          isOpen={!!selectedVideoAppt}
          onClose={() => setSelectedVideoAppt(null)}
          appointment={selectedVideoAppt}
          language={language}
        />

      </div>
    </div>
  );
};

