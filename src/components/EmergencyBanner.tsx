import React from 'react';
import { ShieldAlert, PhoneCall, MapPin, AlertTriangle, Ambulance, ArrowRight } from 'lucide-react';
import { hospitalDetails } from '../data/initialData';

interface EmergencyBannerProps {
  language: 'en' | 'ur';
  onOpenAmbulance?: () => void;
}

export const EmergencyBanner: React.FC<EmergencyBannerProps> = ({ language, onOpenAmbulance }) => {
  const isUrdu = language === 'ur';

  return (
    <section id="emergency" className="py-16 bg-gradient-to-r from-red-600 via-rose-700 to-red-800 text-white relative overflow-hidden">
      
      {/* Decorative Circles */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Main Info */}
          <div className="lg:col-span-8 space-y-4">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 text-white text-xs font-black uppercase tracking-wider backdrop-blur-md">
              <ShieldAlert className="w-4 h-4 text-amber-300 animate-pulse" />
              <span>24/7 Emergency & Trauma Response</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
              {isUrdu ? (
                'ایمرجنسی طبی صورتحال؟ ہم 24 گھنٹے تیار ہیں!'
              ) : (
                'Medical Emergency? We Are Available 24 Hours a Day!'
              )}
            </h2>

            <p className="text-red-100 text-sm sm:text-base max-w-2xl leading-relaxed">
              {isUrdu ? (
                'اگر مریض کو شدید سینے میں درد، سانس لینے میں شدید دشواری، بے ہوشی، فالج کی علامات یا شدید خون بہہ رہا ہو تو بلا تاخیر فاطمہ زہرہ ہسپتال ایمرجنسی وارڈ پہنچیں یا ہیلپ لائن پر کال کریں۔'
              ) : (
                'If you or someone nearby is experiencing severe chest pain, breathing difficulty, stroke symptoms, unconsciousness, or heavy bleeding, reach Fatima Zahra Hospital Emergency immediately or dial our helpline.'
              )}
            </p>

            {/* Red Flag Conditions Warning Box */}
            <div className="p-4 rounded-2xl bg-black/25 backdrop-blur-md border border-white/20 space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                <span>{isUrdu ? 'فوری ایمرجنسی کی علامات (Red Flag Warning)' : 'Immediate Emergency Warning Symptoms'}</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-medium text-white/90">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0"></span>
                  <span>Severe Chest Pain</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0"></span>
                  <span>Shortness of Breath</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0"></span>
                  <span>Stroke / Face Droop</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0"></span>
                  <span>Unconsciousness</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0"></span>
                  <span>Severe Bleeding</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0"></span>
                  <span>Accident Trauma</span>
                </div>
              </div>
            </div>

          </div>

          {/* Action Box */}
          <div className="lg:col-span-4">
            <div className="p-6 rounded-3xl bg-white text-slate-900 shadow-2xl space-y-4">
              
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-red-100 text-red-600">
                  <Ambulance className="w-8 h-8" />
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-bold uppercase">Emergency Helpline</div>
                  <div className="font-extrabold text-xl sm:text-2xl text-red-600">{hospitalDetails.phone}</div>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <span><strong>Location:</strong> Near Fruit Mandi, Ranewal Syedan, District Gujrat, Punjab</span>
                </div>
                <div className="flex items-start gap-2">
                  <PhoneCall className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <span><strong>In-Charge:</strong> Syed Mujahid Hussain Shah</span>
                </div>
              </div>

              <div className="space-y-2">
                <a
                  href={`tel:${hospitalDetails.phone}`}
                  className="w-full py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-lg flex items-center justify-center gap-2 transition-all"
                >
                  <PhoneCall className="w-4 h-4 animate-ping" />
                  <span>{isUrdu ? 'فوری کال کریں' : 'Call Emergency Helpline'}</span>
                </a>

                {onOpenAmbulance && (
                  <button
                    onClick={onOpenAmbulance}
                    className="w-full py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all"
                  >
                    <Ambulance className="w-4 h-4 text-red-500" />
                    <span>{isUrdu ? 'ایمبولینس منگوائیں' : 'Book Emergency Ambulance'}</span>
                  </button>
                )}
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
