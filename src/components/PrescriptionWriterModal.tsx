import React, { useState } from 'react';
import { FileText, Plus, Trash2, X, CheckCircle, Stethoscope, Printer } from 'lucide-react';
import { Prescription, Appointment } from '../types';

interface PrescriptionWriterModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment | null;
  onSavePrescription: (rx: Prescription) => void;
  language: 'en' | 'ur';
}

export const PrescriptionWriterModal: React.FC<PrescriptionWriterModalProps> = ({
  isOpen,
  onClose,
  appointment,
  onSavePrescription,
  language
}) => {
  const isUrdu = language === 'ur';

  const [diagnosis, setDiagnosis] = useState('');
  const [medicines, setMedicines] = useState<Array<{ name: string; dosage: string; frequency: string; duration: string }>>([
    { name: 'Paracetamol 500mg', dosage: '1 tablet', frequency: '3 times daily', duration: '5 days' }
  ]);
  const [advice, setAdvice] = useState('Drink warm water, rest well, avoid oily food.');
  const [followUpDate, setFollowUpDate] = useState('2026-08-01');
  const [saved, setSaved] = useState(false);

  if (!isOpen || !appointment) return null;

  const handleAddMedicine = () => {
    setMedicines(prev => [...prev, { name: '', dosage: '1 tablet', frequency: '2 times daily', duration: '5 days' }]);
  };

  const handleRemoveMedicine = (index: number) => {
    setMedicines(prev => prev.filter((_, i) => i !== index));
  };

  const handleMedicineChange = (index: number, field: string, value: string) => {
    setMedicines(prev => prev.map((med, i) => i === index ? { ...med, [field]: value } : med));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!diagnosis.trim()) return;

    const newRx: Prescription = {
      id: 'RX-' + Math.floor(10000 + Math.random() * 90000),
      patientId: appointment.patientId,
      patientName: appointment.patientName,
      doctorId: appointment.doctorId,
      doctorName: appointment.doctorName,
      date: new Date().toISOString().split('T')[0],
      diagnosis,
      medicines: medicines.filter(m => m.name.trim().length > 0),
      advice,
      followUpDate
    };

    onSavePrescription(newRx);
    setSaved(true);
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
        <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="p-3 bg-teal-100 dark:bg-teal-950/60 rounded-2xl text-teal-700 dark:text-teal-300 shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              {isUrdu ? 'ڈیجیٹل میڈیکل نسخہ (Prescription)' : 'Write Digital Prescription'}
            </h2>
            <p className="text-xs text-slate-500">
              Patient: <strong className="text-slate-900 dark:text-white">{appointment.patientName}</strong> • {appointment.departmentName}
            </p>
          </div>
        </div>

        {saved ? (
          <div className="space-y-6 text-center py-4">
            <div className="p-6 bg-emerald-50 dark:bg-emerald-950/40 rounded-3xl border border-emerald-200 dark:border-emerald-800 space-y-3">
              <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="text-lg font-black text-emerald-900 dark:text-emerald-100">
                Prescription Successfully Saved & Issued!
              </h3>
              <p className="text-xs text-emerald-700 dark:text-emerald-300">
                Patient can view and download this prescription from their Fatima Zahra Hospital Patient Portal.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => window.print()}
                className="w-1/2 py-3 bg-teal-600 text-white font-bold text-xs rounded-xl hover:bg-teal-700 flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>Print Prescription</span>
              </button>
              <button
                onClick={onClose}
                className="w-1/2 py-3 bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-xs rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Clinical Diagnosis / Primary Symptoms *
              </label>
              <input
                type="text"
                required
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                placeholder="e.g. Viral Pharyngitis, Mild Fever & Body Ache"
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500"
              />
            </div>

            {/* Prescribed Medicines */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Rx - Prescribed Medicines & Dosage
                </label>
                <button
                  type="button"
                  onClick={handleAddMedicine}
                  className="px-3 py-1 bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 font-bold text-xs rounded-lg flex items-center gap-1 hover:bg-teal-100"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Medicine
                </button>
              </div>

              {medicines.map((med, index) => (
                <div key={index} className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="flex justify-between items-center gap-2">
                    <input
                      type="text"
                      placeholder="Medicine Name (e.g. Paracetamol 500mg)"
                      value={med.name}
                      onChange={(e) => handleMedicineChange(index, 'name', e.target.value)}
                      className="flex-1 p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                    />
                    {medicines.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveMedicine(index)}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="text"
                      placeholder="Dosage (e.g. 1 tab)"
                      value={med.dosage}
                      onChange={(e) => handleMedicineChange(index, 'dosage', e.target.value)}
                      className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                    />
                    <input
                      type="text"
                      placeholder="Frequency (3x daily)"
                      value={med.frequency}
                      onChange={(e) => handleMedicineChange(index, 'frequency', e.target.value)}
                      className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                    />
                    <input
                      type="text"
                      placeholder="Duration (5 days)"
                      value={med.duration}
                      onChange={(e) => handleMedicineChange(index, 'duration', e.target.value)}
                      className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Medical Advice */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Doctor's Advice & Care Instructions
                </label>
                <textarea
                  rows={2}
                  value={advice}
                  onChange={(e) => setAdvice(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Follow-up OPD Date
                </label>
                <input
                  type="date"
                  value={followUpDate}
                  onChange={(e) => setFollowUpDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-colors"
            >
              Issue Digital Prescription
            </button>

          </form>
        )}

      </div>
    </div>
  );
};
