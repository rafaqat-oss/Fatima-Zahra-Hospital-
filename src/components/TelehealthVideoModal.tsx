import React, { useState } from 'react';
import { Video, Mic, MicOff, VideoOff, PhoneOff, MessageSquare, Send, X, ShieldCheck, Sparkles } from 'lucide-react';
import { Appointment } from '../types';

interface TelehealthVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment | null;
  language: 'en' | 'ur';
}

export const TelehealthVideoModal: React.FC<TelehealthVideoModalProps> = ({
  isOpen,
  onClose,
  appointment,
  language
}) => {
  const isUrdu = language === 'ur';

  const [micMuted, setMicMuted] = useState(false);
  const [videoOff, setVideoOff] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: string; text: string; time: string }>>([
    { sender: 'System', text: 'Encrypted Telehealth Room connected securely to Fatima Zahra Hospital.', time: '09:00 AM' },
    { sender: 'Dr. Syed Mujahid Hussain Shah', text: 'Assalam-o-Alaikum! How are you feeling today?', time: '09:01 AM' }
  ]);
  const [msgInput, setMsgInput] = useState('');

  if (!isOpen || !appointment) return null;

  const handleSendMsg = (e: React.FormEvent) => {
    e.preventDefault();
    if (!msgInput.trim()) return;
    setChatMessages(prev => [
      ...prev,
      { sender: 'You', text: msgInput, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ]);
    setMsgInput('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-3xl max-w-4xl w-full h-[85vh] border border-slate-800 shadow-2xl flex flex-col overflow-hidden relative">
        
        {/* Room Top Bar */}
        <div className="px-6 py-4 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
            <div>
              <h3 className="font-extrabold text-sm sm:text-base flex items-center gap-2">
                <span>Telehealth Video Consultation</span>
                <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded-full font-mono">
                  SECURE LIVE
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Patient: {appointment.patientName} • Consultant: {appointment.doctorName}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Stage & Chat Overlay */}
        <div className="flex-1 bg-slate-950 relative flex overflow-hidden">
          
          {/* Main Remote Video Stream (Doctor / Patient Simulation) */}
          <div className="flex-1 relative flex items-center justify-center bg-slate-950">
            {videoOff ? (
              <div className="text-center space-y-3">
                <div className="w-24 h-24 rounded-full bg-slate-800 border-2 border-slate-700 mx-auto flex items-center justify-center text-slate-500 text-3xl font-black">
                  {appointment.doctorName.charAt(0)}
                </div>
                <div className="text-sm font-bold text-slate-400">Camera is Paused</div>
              </div>
            ) : (
              <div className="w-full h-full relative overflow-hidden bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 flex items-center justify-center">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]" />
                <div className="text-center space-y-4 p-6 z-10">
                  <div className="w-28 h-28 rounded-full border-4 border-emerald-500 shadow-xl overflow-hidden mx-auto bg-slate-800 flex items-center justify-center">
                    <span className="text-4xl font-extrabold text-emerald-400">{appointment.doctorName.charAt(4) || 'D'}</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-white">{appointment.doctorName}</h4>
                    <p className="text-xs text-emerald-400 font-medium">Fatima Zahra Hospital Telehealth OPD</p>
                  </div>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-700 text-[11px] text-slate-300">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>HD Encrypted Audio & Video active</span>
                  </div>
                </div>

                {/* Self View Floating Thumbnail */}
                <div className="absolute bottom-4 right-4 w-32 sm:w-44 h-24 sm:h-32 rounded-2xl bg-slate-800 border-2 border-slate-700 shadow-2xl overflow-hidden flex items-center justify-center">
                  <div className="text-center text-[10px] text-slate-400">
                    <div className="font-bold text-white mb-0.5">{appointment.patientName}</div>
                    <span>Your Camera</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* In-Call Side Chat */}
          {chatOpen && (
            <div className="w-72 sm:w-80 border-l border-slate-800 bg-slate-900 flex flex-col justify-between p-4">
              <div className="font-bold text-xs text-white border-b border-slate-800 pb-2 mb-2 flex justify-between items-center">
                <span>In-Call Consultation Notes</span>
                <button onClick={() => setChatOpen(false)} className="text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                {chatMessages.map((m, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-slate-800 border border-slate-700/60 text-xs space-y-1">
                    <div className="flex justify-between text-[10px] text-emerald-400 font-bold">
                      <span>{m.sender}</span>
                      <span className="text-slate-500 font-mono">{m.time}</span>
                    </div>
                    <p className="text-slate-200 text-[11px] leading-relaxed">{m.text}</p>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendMsg} className="mt-3 flex gap-1.5">
                <input
                  type="text"
                  value={msgInput}
                  onChange={(e) => setMsgInput(e.target.value)}
                  placeholder="Type note..."
                  className="flex-1 p-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
                <button type="submit" className="p-2 rounded-xl bg-emerald-600 text-white">
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          )}

        </div>

        {/* Video Control Bar */}
        <div className="px-6 py-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between">
          <div className="text-xs text-slate-400 font-mono hidden sm:block">
            Room: {appointment.id}
          </div>

          <div className="flex items-center gap-3 mx-auto sm:mx-0">
            <button
              onClick={() => setMicMuted(!micMuted)}
              className={`p-3 rounded-2xl transition-colors ${micMuted ? 'bg-red-500 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'}`}
              title={micMuted ? 'Unmute Mic' : 'Mute Mic'}
            >
              {micMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            <button
              onClick={() => setVideoOff(!videoOff)}
              className={`p-3 rounded-2xl transition-colors ${videoOff ? 'bg-red-500 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'}`}
              title={videoOff ? 'Turn Camera On' : 'Turn Camera Off'}
            >
              {videoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
            </button>

            <button
              onClick={() => setChatOpen(!chatOpen)}
              className={`p-3 rounded-2xl transition-colors ${chatOpen ? 'bg-emerald-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'}`}
              title="Consultation Chat Notes"
            >
              <MessageSquare className="w-5 h-5" />
            </button>

            <button
              onClick={onClose}
              className="p-3.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold transition-colors shadow-lg flex items-center gap-2"
              title="End Call"
            >
              <PhoneOff className="w-5 h-5" />
              <span className="text-xs hidden sm:inline">End Call</span>
            </button>
          </div>

          <div className="text-xs text-emerald-400 font-bold hidden sm:block">
            05:24 Call Time
          </div>
        </div>

      </div>
    </div>
  );
};
