import React from 'react';
import { Doctor } from '../types';
import { initialDoctors } from '../data/initialData';
import { UserCheck, Star, Calendar, Clock, MapPin, Award, CheckCircle2 } from 'lucide-react';

interface DoctorsSectionProps {
  language: 'en' | 'ur';
  onBookDoctor: (doctor: Doctor) => void;
}

export const DoctorsSection: React.FC<DoctorsSectionProps> = ({
  language,
  onBookDoctor
}) => {
  const isUrdu = language === 'ur';

  return (
    <section id="doctors" className="py-16 bg-slate-50 dark:bg-slate-950/60 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider">
            <UserCheck className="w-3.5 h-3.5" />
            <span>{isUrdu ? 'ڈاکٹرز ٹیم' : 'Our Medical Team'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            {isUrdu ? 'فاطمہ زہرہ ہسپتال کے تجربہ کار ڈاکٹرز' : 'Qualified & Compassionate Doctors'}
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base">
            {isUrdu ? 'ہمارے تمام کنسلٹنٹس اور میڈیکل افسران مریضوں کی دیکھ بھال کے لیے ہمہ وقت کوشاں ہیں' : 'Dedicated physicians and specialists providing healthcare near Fruit Mandi, Ranewal Syedan, Gujrat.'}
          </p>
        </div>

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {initialDoctors.map((doc: Doctor) => (
            <div
              key={doc.id}
              className="rounded-3xl bg-white dark:bg-slate-900 p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-5"
            >
              <div className="space-y-4">
                
                {/* Doctor Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center font-bold text-xl shadow-md shrink-0">
                      {doc.name.split(' ')[1]?.[0] || 'D'}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white leading-snug">
                        {doc.name}
                      </h3>
                      <div className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                        {doc.specialization}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Badges */}
                <div className="flex items-center gap-2 text-xs">
                  <span className="px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-semibold border border-emerald-200 dark:border-emerald-800">
                    {doc.departmentName}
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-bold flex items-center gap-1">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>{doc.rating}</span>
                  </span>
                </div>

                {/* Details List */}
                <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <Award className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Experience: <strong className="text-slate-900 dark:text-white">{doc.experience}</strong></span>
                  </div>

                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <MapPin className="w-4 h-4 text-teal-600 shrink-0" />
                    <span>Location: <strong className="text-slate-900 dark:text-white">{doc.roomNo}</strong></span>
                  </div>

                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Hours: <strong className="text-slate-900 dark:text-white">{doc.availableHours}</strong></span>
                  </div>

                  <div className="flex items-start gap-2 text-slate-600 dark:text-slate-300 pt-1">
                    <Calendar className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-slate-700 dark:text-slate-300">Available Days:</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        {doc.availableDays.join(', ')}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Fee / Welfare Tag */}
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-800 flex items-center justify-between text-xs">
                  <span className="text-slate-600 dark:text-slate-300 font-medium">Consultation Fee:</span>
                  <span className="font-extrabold text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> {doc.fee}
                  </span>
                </div>

              </div>

              {/* Action */}
              <button
                onClick={() => onBookDoctor(doc)}
                className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all hover:scale-102 flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>{isUrdu ? 'ان ڈاکٹر کے ساتھ وقت لیں' : 'Book Appointment with Doctor'}</span>
              </button>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
