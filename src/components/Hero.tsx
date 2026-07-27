import React from 'react';
import { Calendar, Bot, Phone, ShieldCheck, HeartPulse, Sparkles, Users, Award, Clock, Truck, BedDouble, Pill, Droplet } from 'lucide-react';
import { hospitalDetails } from '../data/initialData';

interface HeroProps {
  language: 'en' | 'ur';
  onOpenAppointment: () => void;
  onOpenChat: () => void;
  onNavigate: (tab: string) => void;
  onOpenAmbulance?: () => void;
  onOpenBeds?: () => void;
  onOpenPharmacy?: () => void;
  onOpenBloodBank?: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  language,
  onOpenAppointment,
  onOpenChat,
  onNavigate,
  onOpenAmbulance,
  onOpenBeds,
  onOpenPharmacy,
  onOpenBloodBank
}) => {
  const isUrdu = language === 'ur';

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50 via-teal-50/30 to-white dark:from-slate-950 dark:via-emerald-950/20 dark:to-slate-900 py-12 md:py-20 transition-colors">
      {/* Decorative SVG Shapes */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none opacity-40 dark:opacity-20">
        <div className="absolute top-10 right-10 w-72 h-72 rounded-full bg-emerald-300 blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 rounded-full bg-teal-200 blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Main Hero Text Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Welfare & Honor Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs sm:text-sm font-semibold shadow-sm">
              <Sparkles className="w-4 h-4 text-emerald-600 animate-spin" />
              <span>
                {isUrdu 
                  ? 'رانیوال سیداں، ضلع گجرات کا معتبر ویلفیئر طبی ادارہ' 
                  : 'Welfare & Charity Medical Center • Ranewal Syedan, Gujrat'}
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              {isUrdu ? (
                <>
                  <span className="text-emerald-700 dark:text-emerald-400">فاطمہ زہرہ ہسپتال</span> 
                  <br />
                  <span className="text-slate-800 dark:text-slate-200">انسانیت کی خدمت، بلا تفریق اعلیٰ علاج</span>
                </>
              ) : (
                <>
                  Compassionate Care at <br />
                  <span className="text-emerald-600 dark:text-emerald-400">Fatima Zahra Hospital</span>
                </>
              )}
            </h1>

            {/* Description Subtitle */}
            <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg max-w-2xl leading-relaxed mx-auto lg:mx-0">
              {isUrdu ? (
                'مرحوم سید سمیع شاہ / سید مزمل شاہ کی یاد میں قائم کردہ اور سید مجاہد حسین شاہ کی زیرِ نگرانی رانیوال سیداں (نزد فروٹ منڈی، گجرات) میں مریضوں کی دیکھ بھال، ایمرجنسی، زچگی وارڈ اور لیبارٹری کا معیاری ویلفیئر مرکز۔'
              ) : (
                'Providing high-quality healthcare, 24/7 Emergency treatment, Outpatient care (OPD), Maternity & Labor Wards, and Subsidized Laboratory near Fruit Mandi, Ranewal Syedan, District Gujrat. Founded in honor of Late Syed Muzammil Shah.'
              )}
            </p>

            {/* Call To Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
              <button
                onClick={onOpenAppointment}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm sm:text-base shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all hover:scale-105"
              >
                <Calendar className="w-5 h-5" />
                <span>{isUrdu ? 'آن لائن اپائنٹمنٹ لیں' : 'Book Appointment'}</span>
              </button>

              <button
                onClick={onOpenChat}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-900 dark:text-white border-2 border-teal-500 font-bold text-sm sm:text-base shadow-md flex items-center justify-center gap-2 transition-all hover:scale-105"
              >
                <Bot className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                <span>{isUrdu ? 'AI طبی معاون سے مدد لیں' : '24/7 AI Health Bot'}</span>
              </button>

              <a
                href={`tel:${hospitalDetails.phone}`}
                className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm sm:text-base shadow-md flex items-center justify-center gap-2 transition-all"
              >
                <Phone className="w-5 h-5 animate-bounce" />
                <span>{isUrdu ? 'ایمرجنسی کال کریں' : 'Emergency Call'}</span>
              </a>
            </div>

            {/* Quick Hospital Facility Shortcuts */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
              <button
                onClick={onOpenAmbulance}
                className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 shadow-xs flex items-center gap-2.5 text-left group transition-all"
              >
                <div className="p-2 rounded-xl bg-red-100 dark:bg-red-950 text-red-600 shrink-0 group-hover:scale-110 transition-transform">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] font-extrabold text-slate-900 dark:text-white leading-tight">Ambulance</div>
                  <div className="text-[10px] text-slate-500">Book Dispatch</div>
                </div>
              </button>

              <button
                onClick={onOpenBeds}
                className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 shadow-xs flex items-center gap-2.5 text-left group transition-all"
              >
                <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 shrink-0 group-hover:scale-110 transition-transform">
                  <BedDouble className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] font-extrabold text-slate-900 dark:text-white leading-tight">Bed Availability</div>
                  <div className="text-[10px] text-slate-500">ICU & Wards</div>
                </div>
              </button>

              <button
                onClick={onOpenPharmacy}
                className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 shadow-xs flex items-center gap-2.5 text-left group transition-all"
              >
                <div className="p-2 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-600 shrink-0 group-hover:scale-110 transition-transform">
                  <Pill className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] font-extrabold text-slate-900 dark:text-white leading-tight">Dispensary</div>
                  <div className="text-[10px] text-slate-500">Medicines</div>
                </div>
              </button>

              <button
                onClick={onOpenBloodBank}
                className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 shadow-xs flex items-center gap-2.5 text-left group transition-all"
              >
                <div className="p-2 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-600 shrink-0 group-hover:scale-110 transition-transform">
                  <Droplet className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] font-extrabold text-slate-900 dark:text-white leading-tight">Blood Bank</div>
                  <div className="text-[10px] text-slate-500">Group Stock</div>
                </div>
              </button>
            </div>

            {/* Key Trust Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Emergency</div>
                  <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">24/7 Open</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300">
                  <HeartPulse className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Maternity</div>
                  <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">Labor Suite</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Services</div>
                  <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">Lab & OPD</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Mission</div>
                  <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">Welfare & Charity</div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Visual Hospital Feature Box */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Card Container */}
              <div className="rounded-3xl bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-2xl border border-emerald-100 dark:border-slate-800 relative space-y-6">
                
                {/* Hospital Header Banner */}
                <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl p-6 text-white space-y-2 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-15">
                    <HeartPulse className="w-32 h-32" />
                  </div>
                  <div className="text-xs uppercase font-bold tracking-wider text-emerald-200">Ranewal Syedan Gujrat</div>
                  <h3 className="text-xl sm:text-2xl font-black">{isUrdu ? 'فاطمہ زہرہ ویلفیئر ہسپتال' : 'Fatima Zahra Hospital'}</h3>
                  <p className="text-xs text-emerald-100 font-medium">Near Fruit Mandi, Ranewal Syedan, Gujrat</p>
                  
                  <div className="pt-2 flex items-center justify-between text-xs border-t border-emerald-500/50">
                    <span>Contact: Syed Mujahid Hussain Shah</span>
                    <span className="font-bold">{hospitalDetails.phone}</span>
                  </div>
                </div>

                {/* Live OPD Stats */}
                <div className="space-y-3">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Hospital Live Status</div>
                  
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping"></span>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">OPD & Emergency Services</span>
                    </div>
                    <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">ACTIVE</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Users className="w-4 h-4 text-teal-600" />
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Daily OPD Patients Handled</span>
                    </div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">120+ / day</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <HeartPulse className="w-4 h-4 text-emerald-600" />
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Male & Female Wards</span>
                    </div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">24 Beds Available</span>
                  </div>
                </div>

                {/* AI Assistant Callout Box */}
                <div 
                  onClick={onOpenChat}
                  className="cursor-pointer p-4 rounded-2xl bg-gradient-to-r from-teal-500/10 to-emerald-500/10 border border-teal-300 dark:border-teal-800 hover:border-teal-500 transition-all group flex items-center gap-4"
                >
                  <div className="w-12 h-12 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-md group-hover:scale-110 transition-transform">
                    <Bot className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-teal-600 transition-colors">
                      {isUrdu ? '24/7 AI طبی ہیلپ لائن' : '24/7 AI Virtual Assistant'}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {isUrdu ? 'اردو اور انگریزی میں ڈاکٹرز و ادویات سے متعلق سوالات پوچھیں' : 'Ask questions about doctors, symptoms & medical advice'}
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
