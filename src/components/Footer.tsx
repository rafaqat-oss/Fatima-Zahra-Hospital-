import React from 'react';
import { Heart, Phone, MapPin, ShieldAlert, Bot, Calendar } from 'lucide-react';
import { hospitalDetails } from '../data/initialData';

interface FooterProps {
  language: 'en' | 'ur';
  onNavigate: (tab: string) => void;
  onOpenAppointment: () => void;
  onOpenChat: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  language,
  onNavigate,
  onOpenAppointment,
  onOpenChat
}) => {
  const isUrdu = language === 'ur';

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 transition-colors">
      
      {/* Top Footer Callout */}
      <div className="bg-emerald-950/80 border-b border-emerald-900 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-lg sm:text-xl font-extrabold text-white">
              {isUrdu ? 'فاطمہ زہرہ ہسپتال رانیوال سیداں، ضلع گجرات' : 'Fatima Zahra Hospital • Ranewal Syedan, Gujrat'}
            </h3>
            <p className="text-xs text-emerald-200">
              {isUrdu ? 'مرحوم سید مزمل شاہ کی یاد میں قائم کردہ ویلفیئر طبی ادارہ' : 'Welfare & Charity Facility Founded in Memory of Late Syed Muzammil Shah'}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={onOpenAppointment}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" /> Book Appointment
            </button>
            <button
              onClick={onOpenChat}
              className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-md flex items-center gap-2"
            >
              <Bot className="w-4 h-4" /> AI Health Assistant
            </button>
            <a
              href={`tel:${hospitalDetails.phone}`}
              className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md flex items-center gap-2"
            >
              <Phone className="w-4 h-4" /> Emergency: +92 336 1992199
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Column 1: Hospital Mission */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-lg">
                <Heart className="w-6 h-6 fill-emerald-100 text-emerald-600" />
              </div>
              <div className="font-extrabold text-white text-base">Fatima Zahra Hospital</div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Providing compassionate medical treatment, emergency stabilization, OPD consultation, maternity suites, and pathology diagnostics in Ranewal Syedan, Gujrat.
            </p>
            <div className="text-xs text-amber-300 font-medium">
              💚 Managed by Syed Mujahid Hussain Shah & Local Trustees.
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm uppercase tracking-wider">Quick Navigation</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-emerald-400 transition-colors">
                  Home (صفحہ اول)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-emerald-400 transition-colors">
                  About Founder & Mission
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('departments')} className="hover:text-emerald-400 transition-colors">
                  Hospital Departments
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('doctors')} className="hover:text-emerald-400 transition-colors">
                  Consultant Doctors
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('services')} className="hover:text-emerald-400 transition-colors">
                  Medical Services
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact & Address */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm uppercase tracking-wider">Location & Contact</h4>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Near Fruit Mandi, Ranewal Syedan, District Gujrat, Punjab, Pakistan</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
                <a href={`tel:${hospitalDetails.phone}`} className="hover:underline font-bold text-slate-200">
                  +92 336 1992199
                </a>
              </div>
              <div className="text-[11px] text-slate-500">
                Contact Person: Syed Mujahid Hussain Shah
              </div>
            </div>
          </div>

          {/* Column 4: Emergency Warning Notice */}
          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2 text-xs">
            <div className="font-bold text-red-400 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4" /> Medical Disclaimer
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              This application and virtual assistant provide educational guidance only. Always consult a qualified medical professional for diagnosis or treatment.
            </p>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-slate-800 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            © {new Date().getFullYear()} Fatima Zahra Hospital, Ranewal Syedan, Gujrat. All rights reserved.
          </div>
          <div className="text-emerald-400 font-semibold text-[11px]">
            Welfare Healthcare • Dedicated to Humanity
          </div>
        </div>

      </div>
    </footer>
  );
};
