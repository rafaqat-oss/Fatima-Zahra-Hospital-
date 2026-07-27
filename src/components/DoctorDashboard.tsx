import React, { useState, useEffect } from 'react';
import { UserCheck, Calendar, Clock, CheckCircle, XCircle, FileText, Stethoscope, User, Video, Plus } from 'lucide-react';
import { Appointment, UserProfile, Prescription } from '../types';
import { fetchAppointments, updateAppointmentStatus } from '../lib/firebase';
import { PrescriptionWriterModal } from './PrescriptionWriterModal';
import { TelehealthVideoModal } from './TelehealthVideoModal';

interface DoctorDashboardProps {
  user: UserProfile;
  language: 'en' | 'ur';
}

export const DoctorDashboard: React.FC<DoctorDashboardProps> = ({ user, language }) => {
  const isUrdu = language === 'ur';
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedRxAppt, setSelectedRxAppt] = useState<Appointment | null>(null);
  const [selectedVideoAppt, setSelectedVideoAppt] = useState<Appointment | null>(null);

  useEffect(() => {
    loadDoctorAppointments();
  }, [user]);

  const loadDoctorAppointments = async () => {
    setLoading(true);
    const data = await fetchAppointments();
    setAppointments(data);
    setLoading(false);
  };

  const handleStatusChange = async (id: string, newStatus: Appointment['status']) => {
    await updateAppointmentStatus(id, newStatus);
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
  };

  return (
    <div className="py-10 bg-slate-50 dark:bg-slate-950/60 min-h-[70vh] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-teal-700 to-emerald-800 text-white shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="text-xs uppercase font-bold tracking-wider text-teal-200">Doctor Panel • فاطمہ زہرہ ہسپتال</div>
            <h1 className="text-2xl sm:text-3xl font-black">{user.displayName || 'Doctor'}</h1>
            <p className="text-xs sm:text-sm text-teal-100 mt-1">
              Manage OPD queue, write digital prescriptions, and initiate telehealth video calls.
            </p>
          </div>

          <div className="px-4 py-2 rounded-2xl bg-white/20 backdrop-blur-md text-xs font-extrabold text-white">
            Duty Status: ACTIVE (OPD)
          </div>
        </div>

        {/* Appointments Queue */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-teal-600" />
              <span>{isUrdu ? 'مریضوں کی فہرست' : 'Patient Appointment Queue'}</span>
            </h2>
          </div>

          {loading ? (
            <div className="p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-teal-100 dark:bg-teal-950/80 text-teal-600 dark:text-teal-400 mx-auto flex items-center justify-center">
                <Clock className="w-6 h-6 animate-spin" />
              </div>
              <div className="space-y-1">
                <h4 className="font-extrabold text-sm text-slate-800 dark:text-slate-200">
                  {isUrdu ? 'مریضوں کی کیو اور اپائنٹمنٹس فیچ کی جا رہی ہیں...' : 'Fetching OPD Consultation Queue & Patient Files...'}
                </h4>
                <p className="text-xs text-slate-500">Synchronizing with Fatima Zahra Hospital Network...</p>
              </div>
              <div className="w-48 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full mx-auto overflow-hidden">
                <div className="h-full bg-teal-500 rounded-full animate-pulse w-3/4"></div>
              </div>
            </div>
          ) : appointments.length === 0 ? (
            <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center font-medium text-slate-500">
              No appointments scheduled for today yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {appointments.map((appt) => (
                <div
                  key={appt.id}
                  className="rounded-3xl bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    
                    <div className="flex items-center justify-between">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${appt.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' : appt.status === 'completed' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'}`}>
                        {appt.status}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">#{appt.id}</span>
                    </div>

                    <div>
                      <h3 className="font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-1.5">
                        <User className="w-4 h-4 text-emerald-600" />
                        <span>{appt.patientName}</span>
                      </h3>
                      <div className="text-xs text-slate-500">Phone: {appt.patientPhone}</div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Department:</span>
                        <span className="font-bold text-slate-900 dark:text-white">{appt.departmentName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Slot:</span>
                        <span className="font-bold text-slate-900 dark:text-white">{appt.date} ({appt.timeSlot})</span>
                      </div>
                    </div>

                    {appt.notes && (
                      <div className="text-xs text-slate-600 dark:text-slate-300 italic bg-slate-100 dark:bg-slate-800 p-2.5 rounded-lg">
                        Notes: "{appt.notes}"
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedRxAppt(appt)}
                        className="w-1/2 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center justify-center gap-1 shadow-xs"
                      >
                        <FileText className="w-3.5 h-3.5" /> Prescription
                      </button>

                      <button
                        onClick={() => setSelectedVideoAppt(appt)}
                        className="w-1/2 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1 shadow-xs"
                      >
                        <Video className="w-3.5 h-3.5" /> Telehealth
                      </button>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleStatusChange(appt.id, 'completed')}
                        className="w-1/2 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold hover:bg-slate-200 flex items-center justify-center gap-1"
                      >
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Complete
                      </button>
                      <button
                        onClick={() => handleStatusChange(appt.id, 'cancelled')}
                        className="w-1/2 py-1.5 rounded-xl bg-red-50 text-red-600 text-xs font-bold hover:bg-red-100 flex items-center justify-center gap-1"
                      >
                        <XCircle className="w-3.5 h-3.5" /> Cancel
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modals */}
        <PrescriptionWriterModal
          isOpen={!!selectedRxAppt}
          onClose={() => setSelectedRxAppt(null)}
          appointment={selectedRxAppt}
          onSavePrescription={(rx) => {
            console.log('Saved prescription:', rx);
          }}
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
