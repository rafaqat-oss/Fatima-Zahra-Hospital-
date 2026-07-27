import React from 'react';
import { Heart, MapPin, Phone, Users, ShieldCheck, Award, Building2, CheckCircle2 } from 'lucide-react';
import { hospitalDetails } from '../data/initialData';

interface AboutHospitalProps {
  language: 'en' | 'ur';
}

export const AboutHospital: React.FC<AboutHospitalProps> = ({ language }) => {
  const isUrdu = language === 'ur';

  return (
    <section id="about" className="py-16 bg-white dark:bg-slate-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider">
            <Heart className="w-3.5 h-3.5 fill-emerald-600" />
            <span>{isUrdu ? 'ہمارے بارے میں' : 'About Fatima Zahra Hospital'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            {isUrdu ? (
              'رانیوال سیداں، ضلع گجرات میں خدمت خلق کا معتبر نام'
            ) : (
              'Serving Humanity in Ranewal Syedan, District Gujrat'
            )}
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-base">
            {isUrdu ? (
              'فاطمہ زہرہ ہسپتال ایک ویلفیئر طبی ادارہ ہے جو ضرورت مند مریضوں کو فوری طبی امداد اور معیاری علاج کی فراہمی کے لیے وقف ہے۔'
            ) : (
              'Fatima Zahra Hospital is a dedicated charity and welfare medical facility providing compassionate, accessible healthcare near Fruit Mandi, Ranewal Syedan, Gujrat.'
            )}
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Cards */}
          <div className="space-y-6">
            
            {/* Founder Tribute Box */}
            <div className="p-6 rounded-2xl bg-emerald-50/80 dark:bg-slate-800/80 border border-emerald-200 dark:border-emerald-800 space-y-3 relative overflow-hidden">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shadow-md">
                  FZ
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
                    {isUrdu ? 'بانی: مرحوم سید مزمل شاہ' : 'Founder: Late Syed Muzammil Shah'}
                  </h3>
                  <p className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold">
                    {isUrdu ? 'شاندار انسانی و ویلفیئر کاوش' : 'In Loving Memory & Vision for Healthcare Access'}
                  </p>
                </div>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {isUrdu ? (
                  'فاطمہ زہرہ ہسپتال کا قیام مرحوم سید مزمل شاہ کے انسانیت دوست ویژن کے تحت عمل میں لایا گیا تھا تا کہ رانیوال سیداں اور ملحقہ علاقوں کے غریب و مستحق مریضوں کو فوری اور معیاری علاج میسر آ سکے۔'
                ) : (
                  'Founded under the philanthropic vision of late Syed Muzammil Shah, the facility ensures no patient in Ranewal Syedan and surrounding Gujrat areas is turned away due to lack of financial resources.'
                )}
              </p>
            </div>

            {/* Management & Trustees */}
            <div className="p-6 rounded-2xl bg-teal-50/80 dark:bg-slate-800/80 border border-teal-200 dark:border-teal-800 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold shadow-md">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-base text-slate-900 dark:text-white">
                    {isUrdu ? 'انتظامیہ اور ٹرسٹی کمیٹی' : 'Management & Local Trustees'}
                  </h4>
                  <p className="text-xs text-teal-700 dark:text-teal-400 font-medium">
                    {isUrdu ? 'سید مجاہد حسین شاہ کی زیرِ سرپرستی' : 'Managed by Syed Mujahid Hussain Shah & Donors'}
                  </p>
                </div>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {isUrdu ? (
                  'ہسپتال کا انتظام سید مجاہد حسین شاہ (+92 336 1992199) اور مقامی مخیر حضرات کی سرپرستی میں غیر منافع بخش ویلفیئر بنیادوں پر چلایا جا رہا ہے۔'
                ) : (
                  'Under the active administration of Syed Mujahid Hussain Shah (+92 336 1992199), the hospital operates on a non-profit welfare model supported by local trustees and generous donors.'
                )}
              </p>
            </div>

            {/* Quick Location & Contact Info */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs sm:text-sm">
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{hospitalDetails.location}</span>
              </div>
              <a 
                href={`tel:${hospitalDetails.phone}`}
                className="font-bold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1 shrink-0"
              >
                <Phone className="w-3.5 h-3.5" /> {hospitalDetails.phone}
              </a>
            </div>

          </div>

          {/* Right Highlights Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-2">
              <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 w-fit">
                <Building2 className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white text-base">24/7 Emergency Room</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Immediate triage, oxygen support, and resuscitation for acute medical emergencies.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-2">
              <div className="p-2.5 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 w-fit">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white text-base">Male & Female Wards</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Clean, separate inpatient wards with round-the-clock nursing supervision.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-2">
              <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 w-fit">
                <Heart className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white text-base">Maternity & Delivery</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Experienced female doctors and midwives providing safe maternity & labor room care.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-2">
              <div className="p-2.5 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 w-fit">
                <Award className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white text-base">Lab & Dispensary</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Essential diagnostic laboratory tests and subsidized medicine dispensary on premises.
              </p>
            </div>

            {/* Checklist Box */}
            <div className="sm:col-span-2 p-5 rounded-2xl bg-emerald-900 text-white space-y-3">
              <h4 className="font-extrabold text-sm sm:text-base text-emerald-300">
                {isUrdu ? 'فاطمہ زہرہ ہسپتال کی بنیادی خدمات' : 'Core Welfare Commitments'}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Free / Highly Subsidized OPD</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Dedicated Female Doctor Ward Staff</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Subsidized Lab Tests & Medicines</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Located near Fruit Mandi Ranewal Syedan</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
