import React from 'react';
import { Department } from '../types';
import { initialDepartments } from '../data/initialData';
import { Stethoscope, Activity, HeartHandshake, Baby, FlaskConical, BedDouble, CheckCircle } from 'lucide-react';

interface DepartmentsSectionProps {
  language: 'en' | 'ur';
  onSelectDepartment: (deptId: string) => void;
}

export const DepartmentsSection: React.FC<DepartmentsSectionProps> = ({
  language,
  onSelectDepartment
}) => {
  const isUrdu = language === 'ur';

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Activity': return <Activity className="w-6 h-6" />;
      case 'Stethoscope': return <Stethoscope className="w-6 h-6" />;
      case 'HeartHandshake': return <HeartHandshake className="w-6 h-6" />;
      case 'Baby': return <Baby className="w-6 h-6" />;
      case 'FlaskConical': return <FlaskConical className="w-6 h-6" />;
      default: return <BedDouble className="w-6 h-6" />;
    }
  };

  return (
    <section id="departments" className="py-16 bg-white dark:bg-slate-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider">
            <span>{isUrdu ? 'شعبہ جات' : 'Hospital Departments'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            {isUrdu ? 'فاطمہ زہرہ ہسپتال کے فعال شعبے' : 'Specialized Medical Departments'}
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base">
            {isUrdu ? 'ہر شعبے میں ماہر ڈاکٹرز اور تجربہ کار پیرامیڈیکل عملہ موجود ہے' : 'Providing experienced medical oversight across general, maternal, pediatric, surgical, and diagnostic care.'}
          </p>
        </div>

        {/* Department Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {initialDepartments.map((dept: Department) => (
            <div
              key={dept.id}
              className="rounded-3xl bg-slate-50 dark:bg-slate-800/60 p-6 border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-4 hover:border-emerald-500/50 transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
                    {getIcon(dept.icon)}
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium bg-white dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
                    📍 {dept.location}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                    {dept.name}
                  </h3>
                  <div className="text-xs text-emerald-600 dark:text-emerald-400 font-bold mb-2">
                    {dept.urduName}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {dept.description}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                  <div className="text-[11px] text-slate-400 font-bold uppercase">Head Doctor</div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200">{dept.headDoctor}</div>
                </div>

                {/* Services list */}
                <div className="space-y-1.5 pt-1">
                  <div className="text-xs font-bold text-slate-700 dark:text-slate-300">Key Services:</div>
                  <ul className="space-y-1">
                    {dept.services.map((svc, idx) => (
                      <li key={idx} className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>{svc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <button
                onClick={() => onSelectDepartment(dept.id)}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-colors text-center"
              >
                {isUrdu ? 'اس شعبے میں اپائنٹمنٹ لیں' : 'Book Appointment in Department'}
              </button>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
