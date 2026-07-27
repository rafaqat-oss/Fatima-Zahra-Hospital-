import React from 'react';
import { ShieldAlert, Stethoscope, BedDouble, FlaskConical, HeartHandshake, ArrowRight } from 'lucide-react';

interface ServicesSectionProps {
  language: 'en' | 'ur';
  onOpenAppointment: () => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ language, onOpenAppointment }) => {
  const isUrdu = language === 'ur';

  const services = [
    {
      id: 'emergency',
      title: isUrdu ? '24/7 ایمرجنسی روم' : '24/7 Emergency Treatment Room',
      description: isUrdu 
        ? 'حادثاتی صورتحال، تیز بخار، سانس کی تکلیف اور فوری طبی امداد کے لیے 24 گھنٹے فعال شعبہ۔' 
        : 'Around-the-clock urgent medical stabilization, oxygen support, trauma response, and emergency minor surgical procedures.',
      icon: ShieldAlert,
      color: 'from-red-500 to-rose-600',
      tag: '24/7 Active'
    },
    {
      id: 'opd',
      title: isUrdu ? 'بیرونی مریضوں کا شعبہ (OPD)' : 'Outpatient Department (OPD)',
      description: isUrdu 
        ? 'روزمرہ بیماریاں، بلڈ پریشر، شوگر اور جنرل فزیشن سے معائنہ کی سہولت۔' 
        : 'Comprehensive outpatient consultation for general ailments, routine physicals, chronic disease management, and specialist follow-ups.',
      icon: Stethoscope,
      color: 'from-emerald-500 to-teal-600',
      tag: 'Mon - Sat'
    },
    {
      id: 'maternity',
      title: isUrdu ? 'زنانہ و زچگی وارڈ' : 'Maternity Care & Labor Rooms',
      description: isUrdu 
        ? 'خواتین کے لیے لیڈی ڈاکٹرز کی زیرِ نگرانی محفوظ زچگی اور لیبر روم کی سہولیات۔' 
        : 'Dedicated antenatal screening, labor suites, experienced midwives, consultant gynecologist, and post-natal mother & infant care.',
      icon: HeartHandshake,
      color: 'from-purple-500 to-pink-600',
      tag: 'Female Staff'
    },
    {
      id: 'wards',
      title: isUrdu ? 'ان ڈور میڈیکل وارڈز (مردانہ و زنانہ)' : 'Male & Female Inpatient Wards',
      description: isUrdu 
        ? 'مریضوں کے ہسپتال میں داخلے کے لیے صاف ستھرے علیحدہ مردانہ اور زنانہ وارڈز۔' 
        : 'Supervised, clean, and well-maintained separate inpatient wards for patients requiring multi-day observation and treatment.',
      icon: BedDouble,
      color: 'from-blue-500 to-indigo-600',
      tag: 'Inpatient Beds'
    },
    {
      id: 'lab',
      title: isUrdu ? 'لیبارٹری و ادویات ڈسپنسری' : 'Pathology Laboratory & Dispensary',
      description: isUrdu 
        ? 'خون کے نمونہ جات کی لیب ٹیسٹنگ اور رعایتی نرخوں پر معیاری ادویات۔' 
        : 'On-site diagnostic blood testing (CBC, Sugar, Liver/Kidney profiles) and subsidized pharmacy for patients.',
      icon: FlaskConical,
      color: 'from-amber-500 to-orange-600',
      tag: 'Subsidized'
    }
  ];

  return (
    <section id="services" className="py-16 bg-slate-50 dark:bg-slate-950/60 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider">
            <span>{isUrdu ? 'طبی سہولیات' : 'Available Hospital Services'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            {isUrdu ? 'فاطمہ زہرہ ہسپتال کی اہم خدمات' : 'Comprehensive Healthcare Under One Roof'}
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base">
            {isUrdu ? 'رانیوال سیداں، گجرات کے شہریوں کے لیے جدید اور معیاری سہولیات' : 'Equipped to provide urgent, general, and specialized medical care to the community near Fruit Mandi, Ranewal Syedan, Gujrat.'}
          </p>
        </div>

        {/* Services Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <div 
                key={service.id}
                className="rounded-3xl bg-white dark:bg-slate-900 p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between"
              >
                <div className="space-y-4">
                  
                  {/* Icon & Tag Header */}
                  <div className="flex items-center justify-between">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.color} text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold">
                      {service.tag}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="font-extrabold text-xl text-slate-900 dark:text-white mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {service.description}
                    </p>
                  </div>

                </div>

                {/* Footer Action */}
                <div className="pt-6 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <button
                    onClick={onOpenAppointment}
                    className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5 hover:gap-2 transition-all"
                  >
                    <span>{isUrdu ? 'اپائنٹمنٹ بک کریں' : 'Book Appointment'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
