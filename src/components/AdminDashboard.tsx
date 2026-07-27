import React, { useState, useEffect } from 'react';
import { Users, Calendar, Stethoscope, Building2, MessageSquare, Settings, Plus, CheckCircle, XCircle, Trash2 } from 'lucide-react';
import { Doctor, Appointment, FeedbackItem, UserProfile } from '../types';
import { initialDoctors, initialDepartments, initialFeedback } from '../data/initialData';
import { fetchAppointments, updateAppointmentStatus } from '../lib/firebase';

interface AdminDashboardProps {
  user: UserProfile;
  language: 'en' | 'ur';
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, language }) => {
  const isUrdu = language === 'ur';

  const [activeTab, setActiveTab] = useState<'overview' | 'doctors' | 'appointments' | 'feedback'>('overview');
  const [doctors, setDoctors] = useState<Doctor[]>(initialDoctors);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>(initialFeedback);
  const [loading, setLoading] = useState(true);

  // Add doctor form state
  const [showAddDoctor, setShowAddDoctor] = useState(false);
  const [newDocName, setNewDocName] = useState('');
  const [newDocSpec, setNewDocSpec] = useState('');
  const [newDocDept, setNewDocDept] = useState(initialDepartments[0].id);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    const appts = await fetchAppointments();
    setAppointments(appts);
    setLoading(false);
  };

  const handleAddDoctor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocName) return;

    const dept = initialDepartments.find(d => d.id === newDocDept) || initialDepartments[0];
    const newDoctor: Doctor = {
      id: 'doc-' + Date.now(),
      name: newDocName,
      departmentId: dept.id,
      departmentName: dept.name,
      specialization: newDocSpec || 'Consultant Specialist',
      phone: '+92 336 1992199',
      email: `${newDocName.toLowerCase().replace(/\s+/g, '.')}@fatimazahra.org`,
      availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      availableHours: '09:00 AM - 02:00 PM',
      roomNo: 'OPD Room ' + (doctors.length + 101),
      fee: 'Welfare (Free / Optional)',
      rating: 5.0,
      experience: '5+ Years',
      status: 'active'
    };

    setDoctors(prev => [...prev, newDoctor]);
    setNewDocName('');
    setNewDocSpec('');
    setShowAddDoctor(false);
  };

  const handleStatusChange = async (id: string, newStatus: Appointment['status']) => {
    await updateAppointmentStatus(id, newStatus);
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
  };

  return (
    <div className="py-10 bg-slate-50 dark:bg-slate-950/60 min-h-[75vh] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-800 via-indigo-900 to-slate-900 text-white shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="text-xs uppercase font-bold tracking-wider text-purple-300">Admin Control Panel • فاطمہ زہرہ ہسپتال</div>
            <h1 className="text-2xl sm:text-3xl font-black">Hospital Operations & Management</h1>
            <p className="text-xs sm:text-sm text-purple-200 mt-1">
              Ranewal Syedan, Gujrat • Manage doctors, patients, appointments, and charity stats.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${activeTab === 'overview' ? 'bg-white text-purple-900' : 'bg-white/10 hover:bg-white/20'}`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('doctors')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${activeTab === 'doctors' ? 'bg-white text-purple-900' : 'bg-white/10 hover:bg-white/20'}`}
            >
              Doctors ({doctors.length})
            </button>
            <button
              onClick={() => setActiveTab('appointments')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${activeTab === 'appointments' ? 'bg-white text-purple-900' : 'bg-white/10 hover:bg-white/20'}`}
            >
              Appointments ({appointments.length})
            </button>
            <button
              onClick={() => setActiveTab('feedback')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${activeTab === 'feedback' ? 'bg-white text-purple-900' : 'bg-white/10 hover:bg-white/20'}`}
            >
              Feedback
            </button>
          </div>
        </div>

        {/* Tab: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Analytics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-xs font-bold uppercase">Total Appointments</span>
                  <Calendar className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="text-3xl font-black text-slate-900 dark:text-white">{appointments.length || 18}</div>
                <div className="text-xs text-emerald-600 font-semibold">+12% from last month</div>
              </div>

              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-xs font-bold uppercase">Active Consultants</span>
                  <Stethoscope className="w-5 h-5 text-teal-600" />
                </div>
                <div className="text-3xl font-black text-slate-900 dark:text-white">{doctors.length}</div>
                <div className="text-xs text-teal-600 font-semibold">Across 6 departments</div>
              </div>

              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-xs font-bold uppercase">Daily OPD Capacity</span>
                  <Users className="w-5 h-5 text-indigo-600" />
                </div>
                <div className="text-3xl font-black text-slate-900 dark:text-white">150+</div>
                <div className="text-xs text-indigo-600 font-semibold">Patients / day</div>
              </div>

              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-xs font-bold uppercase">Welfare Patients</span>
                  <Building2 className="w-5 h-5 text-purple-600" />
                </div>
                <div className="text-3xl font-black text-slate-900 dark:text-white">100% Free/Subsidized</div>
                <div className="text-xs text-purple-600 font-semibold">Donor & Trustee Funded</div>
              </div>

            </div>

            {/* Quick Actions */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">Hospital Administration Tasks</h3>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => { setActiveTab('doctors'); setShowAddDoctor(true); }}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center gap-2 shadow-sm"
                >
                  <Plus className="w-4 h-4" /> Add New Doctor
                </button>
                <button
                  onClick={() => setActiveTab('appointments')}
                  className="px-4 py-2.5 rounded-xl bg-teal-600 text-white font-bold text-xs flex items-center gap-2 shadow-sm"
                >
                  <Calendar className="w-4 h-4" /> Review Appointments
                </button>
                <button
                  onClick={() => setActiveTab('feedback')}
                  className="px-4 py-2.5 rounded-xl bg-purple-600 text-white font-bold text-xs flex items-center gap-2 shadow-sm"
                >
                  <MessageSquare className="w-4 h-4" /> Community Reviews
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Doctors Management */}
        {activeTab === 'doctors' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">Hospital Doctors Directory</h3>
              <button
                onClick={() => setShowAddDoctor(!showAddDoctor)}
                className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Add Doctor
              </button>
            </div>

            {/* Add Doctor Form */}
            {showAddDoctor && (
              <form onSubmit={handleAddDoctor} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800 space-y-4">
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">Register New Doctor</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Doctor Full Name"
                    value={newDocName}
                    onChange={(e) => setNewDocName(e.target.value)}
                    className="p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                  />
                  <input
                    type="text"
                    placeholder="Specialization (e.g. Cardiologist)"
                    value={newDocSpec}
                    onChange={(e) => setNewDocSpec(e.target.value)}
                    className="p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                  />
                  <select
                    value={newDocDept}
                    onChange={(e) => setNewDocDept(e.target.value)}
                    className="p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white font-bold"
                  >
                    {initialDepartments.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
                <button type="submit" className="px-5 py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl">
                  Save Doctor Profile
                </button>
              </form>
            )}

            {/* Doctor List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {doctors.map(doc => (
                <div key={doc.id} className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="font-extrabold text-slate-900 dark:text-white text-base">{doc.name}</div>
                  <div className="text-xs text-emerald-600 font-bold">{doc.specialization}</div>
                  <div className="text-xs text-slate-500">{doc.departmentName} • {doc.roomNo}</div>
                  <div className="text-xs text-slate-400">Hours: {doc.availableHours}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab: Appointments Management */}
        {activeTab === 'appointments' && (
          <div className="space-y-6">
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">All Scheduled Appointments</h3>
            {loading ? (
              <div className="p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 mx-auto flex items-center justify-center">
                  <Calendar className="w-6 h-6 animate-spin" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-extrabold text-sm text-slate-800 dark:text-slate-200">
                    Loading Hospital Appointments Database...
                  </h4>
                  <p className="text-xs text-slate-500">Retrieving records from Fatima Zahra Firestore Engine...</p>
                </div>
                <div className="w-48 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full mx-auto overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full animate-pulse w-3/4"></div>
                </div>
              </div>
            ) : appointments.length === 0 ? (
              <div className="p-8 bg-white dark:bg-slate-900 rounded-3xl text-center text-slate-500 text-sm">
                No appointments logged in the system.
              </div>
            ) : (
              <div className="space-y-3">
                {appointments.map(appt => (
                  <div key={appt.id} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
                    <div>
                      <div className="font-extrabold text-slate-900 dark:text-white text-sm">{appt.patientName} (Phone: {appt.patientPhone})</div>
                      <div className="text-slate-500">Doctor: <strong>{appt.doctorName}</strong> | {appt.departmentName}</div>
                      <div className="text-emerald-600 font-semibold">{appt.date} at {appt.timeSlot}</div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-full font-bold uppercase ${appt.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' : appt.status === 'completed' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'}`}>
                        {appt.status}
                      </span>
                      <button
                        onClick={() => handleStatusChange(appt.id, 'completed')}
                        className="p-2 rounded-xl bg-emerald-50 text-emerald-700 font-bold hover:bg-emerald-100"
                      >
                        Complete
                      </button>
                      <button
                        onClick={() => handleStatusChange(appt.id, 'cancelled')}
                        className="p-2 rounded-xl bg-red-50 text-red-600 font-bold hover:bg-red-100"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab: Feedback */}
        {activeTab === 'feedback' && (
          <div className="space-y-6">
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">Patient Community Reviews & Feedback</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {feedbacks.map(fb => (
                <div key={fb.id} className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-slate-900 dark:text-white text-sm">{fb.name}</span>
                    <span className="text-amber-500 font-bold">★ {fb.rating}/5</span>
                  </div>
                  <div className="text-slate-500 font-medium">Category: {fb.category}</div>
                  <p className="text-slate-700 dark:text-slate-300 italic">"{fb.comment}"</p>
                  <div className="text-[10px] text-slate-400">{fb.date}</div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
