import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, Send, Mic, MicOff, Volume2, VolumeX, ShieldAlert, Sparkles, X, 
  Globe, User, Image as ImageIcon, Trash2, Plus, Pin, Search, Calendar,
  MessageSquare, ChevronRight, PhoneCall, Check, ArrowLeft, Clock
} from 'lucide-react';
import { ChatMessage, UserProfile, Doctor } from '../types';
import { hospitalDetails } from '../data/initialData';
import { saveChatMessage } from '../lib/firebase';

export interface ChatSession {
  id: string;
  title: string;
  messages: (ChatMessage & { imageUrl?: string; isEmergency?: boolean })[];
  pinned: boolean;
  createdAt: number;
  updatedAt: number;
  language: 'en' | 'ur';
}

interface AIChatbotProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile | null;
  language: 'en' | 'ur';
  onBookAppointment?: (deptId?: string, doctorId?: string) => void;
}

const LOCAL_STORAGE_KEY = 'fatima_zahra_chat_sessions_v2';

export const AIChatbot: React.FC<AIChatbotProps> = ({
  isOpen,
  onClose,
  user,
  language: initialLanguage,
  onBookAppointment
}) => {
  const [chatLanguage, setChatLanguage] = useState<'en' | 'ur'>(initialLanguage);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string>('');
  
  const [input, setInput] = useState('');
  const [selectedImage, setSelectedImage] = useState<{ data: string; mimeType: string; url: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [emergencyAlert, setEmergencyAlert] = useState<string | null>(null);

  // Sidebar & Search states
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isUrdu = chatLanguage === 'ur';

  // Initialize or Load Saved Chat Sessions from LocalStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed: ChatSession[] = JSON.parse(saved);
        if (parsed.length > 0) {
          setSessions(parsed);
          setActiveSessionId(parsed[0].id);
          return;
        }
      }
    } catch (e) {
      console.warn('Failed to load chat history from storage:', e);
    }

    // Default Initial Session
    const defaultSession: ChatSession = {
      id: 'session-' + Date.now(),
      title: initialLanguage === 'ur' ? 'نئی طبی بات چیت' : 'New Health Consultation',
      pinned: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      language: initialLanguage,
      messages: [
        {
          id: 'welcome-1',
          sender: 'bot',
          text: initialLanguage === 'ur'
            ? 'فاطمہ زہرہ ہسپتال رانیوال سیداں کے AI طبی معاون میں خوش آمدید! آپ کسی علامات، دوا کی تعلیمی معلومات، یا جلدی نشان/رپورٹ کی تصویر کے بارے میں پوچھ سکتے ہیں۔'
            : 'Welcome to Fatima Zahra Hospital AI Health Assistant! Ask about symptoms, over-the-counter medicine precautions, OPD schedules, or upload photos of skin rash/lab reports.',
          language: initialLanguage,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]
    };

    setSessions([defaultSession]);
    setActiveSessionId(defaultSession.id);
  }, []);

  // Save Sessions to LocalStorage on update
  useEffect(() => {
    if (sessions.length > 0) {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(sessions));
      } catch (e) {
        console.warn('Failed to save chat sessions:', e);
      }
    }
  }, [sessions]);

  // Current active session
  const activeSession = sessions.find(s => s.id === activeSessionId) || sessions[0];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeSession?.messages]);

  // Create New Chat Session
  const handleNewChat = () => {
    const newSession: ChatSession = {
      id: 'session-' + Date.now(),
      title: isUrdu ? 'نئی طبی بات چیت' : 'New Health Consultation',
      pinned: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      language: chatLanguage,
      messages: [
        {
          id: 'welcome-' + Date.now(),
          sender: 'bot',
          text: isUrdu
            ? 'سلام! میں فاطمہ زہرہ ہسپتال رانیوال سیداں کا AI معاون ہوں۔ آپ کس طرح کی رہنمائی چاہتے ہیں؟'
            : 'Hello! I am Fatima Zahra Hospital AI Health Assistant. How can I guide you today?',
          language: chatLanguage,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]
    };

    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
    setEmergencyAlert(null);
  };

  // Toggle Pin Chat
  const handleTogglePin = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSessions(prev =>
      prev.map(s => s.id === sessionId ? { ...s, pinned: !s.pinned } : s)
    );
  };

  // Delete Chat Session
  const handleDeleteSession = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (sessions.length <= 1) {
      handleNewChat();
    }
    const filtered = sessions.filter(s => s.id !== sessionId);
    setSessions(filtered);
    if (activeSessionId === sessionId && filtered.length > 0) {
      setActiveSessionId(filtered[0].id);
    }
  };

  // Handle Image Selection
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Image file size must be less than 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = (reader.result as string).split(',')[1];
      setSelectedImage({
        data: base64String,
        mimeType: file.type || 'image/jpeg',
        url: URL.createObjectURL(file)
      });
    };
    reader.readAsDataURL(file);
  };

  // Voice Recognition Setup
  const toggleListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser. Please type your message.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = chatLanguage === 'ur' ? 'ur-PK' : 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognition.start();
    } catch (e) {
      console.error('Speech recognition error:', e);
      setIsListening(false);
    }
  };

  // Text To Speech
  const speakText = (text: string) => {
    if (!soundEnabled || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const cleanText = text.replace(/[*#_]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = chatLanguage === 'ur' ? 'ur-PK' : 'en-US';
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis note:', e);
    }
  };

  // Sample Symptoms Chips
  const sampleSymptoms = isUrdu ? [
    '🤒 مجھے دو دن سے شدید بخار اور گلے میں درد ہے',
    '🧴 جلد پر سرخ دانے اور خارش ہو رہی ہے',
    '🤰 گائناکالوجسٹ ڈاکٹر زہرہ بتول سے اپائنٹمنٹ کب مل سکتی ہے؟',
    '🚨 سینے میں درد اور سانس لینے میں دشواری ہے'
  ] : [
    '🤒 Mild fever, throat soreness and headache for 2 days',
    '🧴 Red skin rash and itching on arms',
    '🤰 When is Consultant Gynecologist Dr. Zahra Batool available?',
    '🚨 Severe chest pain and difficulty breathing'
  ];

  // Send Message to Gemini AI Backend
  const handleSend = async (customText?: string) => {
    const userText = (typeof customText === 'string' ? customText : input).trim();
    if ((!userText && !selectedImage) || isLoading || !activeSession) return;

    const currentImage = selectedImage;
    setInput('');
    setSelectedImage(null);

    const userMsg: ChatMessage & { imageUrl?: string } = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text: userText || (isUrdu ? '[منسلک تصویر]' : '[Attached Image]'),
      imageUrl: currentImage?.url,
      language: chatLanguage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Auto-update Session Title if default
    let updatedTitle = activeSession.title;
    if (activeSession.messages.length <= 1 && userText) {
      updatedTitle = userText.slice(0, 28) + (userText.length > 28 ? '...' : '');
    }

    // Append user message to active session
    setSessions(prev => prev.map(s => {
      if (s.id === activeSession.id) {
        return {
          ...s,
          title: updatedTitle,
          updatedAt: Date.now(),
          messages: [...s.messages, userMsg]
        };
      }
      return s;
    }));

    setIsLoading(true);
    setEmergencyAlert(null);

    if (user) {
      saveChatMessage(user.uid, { sender: 'user', text: userText || '[Attached Image]', language: chatLanguage, timestamp: new Date().toISOString() });
    }

    try {
      const historyPayload = activeSession.messages
        .filter(m => !m.id.startsWith('welcome-'))
        .slice(-6)
        .map(m => ({
          role: m.sender === 'user' ? 'user' : 'model',
          parts: [{ text: m.text }]
        }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          language: chatLanguage,
          history: historyPayload,
          image: currentImage ? { data: currentImage.data, mimeType: currentImage.mimeType } : null
        })
      });

      const data = await response.json();

      const botMsg: ChatMessage & { isEmergency?: boolean } = {
        id: 'bot-' + Date.now(),
        sender: 'bot',
        text: data.reply || (isUrdu
          ? 'فاطمہ زہرہ ہسپتال میں رابطہ کرنے کا شکریہ۔ یہ چیٹ بوٹ صرف تعلیمی معلومات فراہم کرتا ہے۔ براہ کرم تشخیص یا علاج کے لیے کسی مستند ڈاکٹر سے رجوع کریں۔'
          : 'Thank you for contacting Fatima Zahra Hospital. This AI assistant provides educational information only. Please consult a qualified doctor for diagnosis or treatment.'),
        language: chatLanguage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isEmergency: data.isEmergency
      };

      setSessions(prev => prev.map(s => {
        if (s.id === activeSession.id) {
          return {
            ...s,
            updatedAt: Date.now(),
            messages: [...s.messages, botMsg]
          };
        }
        return s;
      }));

      if (data.isEmergency) {
        setEmergencyAlert(
          isUrdu
            ? '🚨 **ایمرجنسی الرٹ**: شدید علامات کے لیے فاطمہ زہرہ ہسپتال 24/7 ایمرجنسی وارڈ پہنچیں یا کال کریں: +92 336 1992199'
            : '🚨 **EMERGENCY WARNING**: Please seek immediate emergency care at Fatima Zahra Hospital 24/7 Emergency Ward or call +92 336 1992199!'
        );
      }

      speakText(botMsg.text);

      if (user) {
        saveChatMessage(user.uid, { sender: 'bot', text: botMsg.text, language: chatLanguage, timestamp: new Date().toISOString(), isEmergency: data.isEmergency });
      }

    } catch (err) {
      console.error('Chat AI error:', err);
      const fallbackMsg: ChatMessage = {
        id: 'bot-err-' + Date.now(),
        sender: 'bot',
        text: isUrdu 
          ? 'فاطمہ زہرہ ہسپتال رانیوال سیداں کی ہیلپ لائن پر رابطہ کریں: +92 336 1992199\n\nیہ چیٹ بوٹ صرف تعلیمی معلومات فراہم کرتا ہے۔ براہ کرم تشخیص یا علاج کے لیے کسی مستند ڈاکٹر سے رجوع کریں۔'
          : 'For immediate medical guidance, please call Fatima Zahra Hospital helpline at +92 336 1992199.\n\nThis AI assistant provides educational information only. Please consult a qualified doctor for diagnosis and treatment.',
        language: chatLanguage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setSessions(prev => prev.map(s => {
        if (s.id === activeSession.id) {
          return {
            ...s,
            updatedAt: Date.now(),
            messages: [...s.messages, fallbackMsg]
          };
        }
        return s;
      }));
    } finally {
      setIsLoading(false);
    }
  };

  // Filtered Sessions for Search
  const filteredSessions = sessions.filter(s =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.messages.some(m => m.text.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const pinnedSessions = filteredSessions.filter(s => s.pinned);
  const unpinnedSessions = filteredSessions.filter(s => !s.pinned);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-md">
      <div className="w-full sm:max-w-5xl h-full sm:h-[720px] rounded-none sm:rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl flex overflow-hidden">
        
        {/* SIDEBAR: CHAT SESSIONS & HISTORY */}
        <div className={`${isSidebarOpen ? 'w-full sm:w-80 flex' : 'hidden sm:hidden'} flex-col bg-slate-900 text-slate-100 border-r border-slate-800 shrink-0`}>
          
          {/* Sidebar Header */}
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-emerald-600 flex items-center justify-center font-bold text-white shadow-md">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-white">AI Health Assistant</h3>
                <span className="text-[10px] text-emerald-400 font-semibold block">Fatima Zahra Hospital</span>
              </div>
            </div>

            <button
              onClick={() => setIsSidebarOpen(false)}
              className="sm:hidden p-2 rounded-xl text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* New Chat Button */}
          <div className="p-3">
            <button
              onClick={handleNewChat}
              className="w-full py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all hover:scale-[1.02]"
            >
              <Plus className="w-4 h-4" />
              <span>{isUrdu ? 'نئی بات چیت شروع کریں' : 'New Health Chat'}</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="px-3 pb-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder={isUrdu ? 'چیٹ ہسٹری میں تلاش کریں...' : 'Search chat history...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-800/80 text-xs text-white placeholder-slate-400 border border-slate-700/60 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Sessions List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-4">
            
            {/* Pinned Sessions */}
            {pinnedSessions.length > 0 && (
              <div>
                <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <Pin className="w-3 h-3" />
                  <span>{isUrdu ? 'اہم چیٹس' : 'Pinned Chats'}</span>
                </div>
                <div className="space-y-1">
                  {pinnedSessions.map(session => (
                    <div
                      key={session.id}
                      onClick={() => {
                        setActiveSessionId(session.id);
                        if (window.innerWidth < 640) setIsSidebarOpen(false);
                      }}
                      className={`group p-2.5 rounded-xl text-xs flex items-center justify-between cursor-pointer transition-colors ${activeSessionId === session.id ? 'bg-emerald-950/80 text-emerald-300 font-bold border border-emerald-800' : 'text-slate-300 hover:bg-slate-800/60'}`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <MessageSquare className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className="truncate">{session.title}</span>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={(e) => handleTogglePin(session.id, e)} className="p-1 text-emerald-400">
                          <Pin className="w-3 h-3 fill-emerald-400" />
                        </button>
                        <button onClick={(e) => handleDeleteSession(session.id, e)} className="p-1 text-red-400">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Unpinned Recent Sessions */}
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{isUrdu ? 'حالیہ بات چیت' : 'Recent Chats'}</span>
              </div>
              {unpinnedSessions.length === 0 ? (
                <div className="text-center text-[11px] text-slate-500 py-4">
                  {isUrdu ? 'کوئی چیٹ محفوظ نہیں ہے' : 'No recent chats found'}
                </div>
              ) : (
                <div className="space-y-1">
                  {unpinnedSessions.map(session => (
                    <div
                      key={session.id}
                      onClick={() => {
                        setActiveSessionId(session.id);
                        if (window.innerWidth < 640) setIsSidebarOpen(false);
                      }}
                      className={`group p-2.5 rounded-xl text-xs flex items-center justify-between cursor-pointer transition-colors ${activeSessionId === session.id ? 'bg-emerald-950/80 text-emerald-300 font-bold border border-emerald-800' : 'text-slate-300 hover:bg-slate-800/60'}`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <MessageSquare className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{session.title}</span>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={(e) => handleTogglePin(session.id, e)} className="p-1 text-slate-400 hover:text-emerald-400">
                          <Pin className="w-3 h-3" />
                        </button>
                        <button onClick={(e) => handleDeleteSession(session.id, e)} className="p-1 text-slate-400 hover:text-red-400">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Sidebar Footer */}
          <div className="p-3 border-t border-slate-800 text-[10px] text-slate-400 text-center">
            🔒 Auto-saved to Fatima Zahra Cloud
          </div>
        </div>

        {/* MAIN CHAT CONVERSATION VIEW */}
        <div className="flex-1 flex flex-col h-full bg-slate-50 dark:bg-slate-950 overflow-hidden">
          
          {/* Main View Header */}
          <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 text-white p-3.5 px-5 flex items-center justify-between shrink-0 shadow-sm">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold flex items-center gap-1.5"
                title="Toggle Recent Chats History"
              >
                <MessageSquare className="w-4 h-4 text-emerald-200" />
                <span className="hidden sm:inline">{isUrdu ? 'چیٹ ہسٹری' : 'History'}</span>
              </button>

              <div className="h-5 w-px bg-white/20"></div>

              <div>
                <h2 className="font-extrabold text-sm sm:text-base flex items-center gap-2">
                  <span>{activeSession?.title || 'Fatima Zahra AI Assistant'}</span>
                </h2>
                <span className="text-[10px] text-emerald-200 block">
                  {isUrdu ? 'فاطمہ زہرہ ہسپتال • رانیوال سیداں، گجرات' : 'Fatima Zahra Hospital • Ranewal Syedan, Gujrat'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setChatLanguage(chatLanguage === 'en' ? 'ur' : 'en')}
                className="p-1.5 px-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold flex items-center gap-1.5"
                title="Switch Language"
              >
                <Globe className="w-3.5 h-3.5 text-emerald-200" />
                <span>{chatLanguage === 'en' ? 'اردو' : 'English'}</span>
              </button>

              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20"
                title="Toggle AI Speech Output"
              >
                {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-200" /> : <VolumeX className="w-4 h-4 text-red-300" />}
              </button>

              <button
                onClick={onClose}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Mandatory Safety Disclaimer Banner */}
          <div className="bg-amber-50 dark:bg-amber-950/80 border-b border-amber-200 dark:border-amber-900/60 p-2.5 px-5 text-[11px] text-amber-900 dark:text-amber-200 font-semibold flex items-center gap-2 shrink-0">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              {isUrdu
                ? 'یہ چیٹ بوٹ صرف تعلیمی معلومات فراہم کرتا ہے۔ تشخیص یا علاج کے لیے کسی مستند ڈاکٹر سے رجوع کریں۔'
                : 'This AI assistant provides educational information only. Please consult a qualified doctor for diagnosis and treatment.'}
            </span>
          </div>

          {/* Emergency Alert Protocol Banner */}
          {emergencyAlert && (
            <div className="bg-red-600 text-white p-3 px-5 text-xs font-extrabold flex items-center justify-between animate-pulse shrink-0">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 shrink-0" />
                <span>{emergencyAlert}</span>
              </div>
              <a
                href={`tel:${hospitalDetails.phone}`}
                className="px-3 py-1.5 bg-white text-red-600 rounded-xl font-black text-xs shrink-0 hover:bg-red-50 flex items-center gap-1"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Emergency: +92 336 1992199</span>
              </a>
            </div>
          )}

          {/* Chat Messages Stream */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
            
            {/* Quick Sample Questions Chips */}
            {activeSession?.messages.length <= 2 && (
              <div className="p-4 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-2.5 shadow-sm">
                <div className="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>{isUrdu ? 'کسی علامات یا سوال پر کلک کریں:' : 'Click a symptom to start AI consultation:'}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {sampleSymptoms.map((symptom, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSend(symptom)}
                      disabled={isLoading}
                      className="text-left text-xs bg-white dark:bg-slate-800 text-emerald-900 dark:text-emerald-100 border border-emerald-200 dark:border-emerald-700/60 p-2.5 rounded-xl hover:bg-emerald-100/60 dark:hover:bg-emerald-900/60 transition-colors shadow-xs"
                    >
                      {symptom}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Message Item Loop */}
            {activeSession?.messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 text-white font-bold shadow-md ${msg.sender === 'user' ? 'bg-emerald-600' : 'bg-teal-700'}`}>
                  {msg.sender === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                </div>

                <div className={`max-w-[85%] sm:max-w-[75%] rounded-3xl p-4 text-xs sm:text-sm space-y-3 shadow-sm ${msg.sender === 'user' ? 'bg-emerald-600 text-white rounded-tr-none' : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-tl-none'}`}>
                  
                  {msg.imageUrl && (
                    <div className="rounded-2xl overflow-hidden border border-emerald-400/40 max-w-sm">
                      <img src={msg.imageUrl} alt="Uploaded symptom photo" className="w-full h-auto object-cover max-h-56" />
                    </div>
                  )}

                  <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>

                  {/* If message suggests booking an appointment */}
                  {msg.sender === 'bot' && onBookAppointment && (
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-700 flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => onBookAppointment()}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{isUrdu ? 'فاطمہ زہرہ ہسپتال میں اپائنٹمنٹ بک کریں' : 'Book Specialist Consultation'}</span>
                      </button>
                    </div>
                  )}

                  <div className={`text-[10px] text-right ${msg.sender === 'user' ? 'text-emerald-200' : 'text-slate-400'}`}>
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            ))}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex items-center gap-3 p-4 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 max-w-[80%] shadow-sm">
                <div className="w-8 h-8 rounded-2xl bg-teal-700 flex items-center justify-center text-white shrink-0">
                  <Bot className="w-4 h-4 animate-bounce" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-700 dark:text-slate-200 font-bold">
                    {isUrdu ? 'AI طبی معاون جواب تیار کر رہا ہے...' : 'AI Assistant is analyzing symptoms & guidelines...'}
                  </span>
                  <span className="flex gap-1 items-center">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse [animation-delay:200ms]"></span>
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse [animation-delay:400ms]"></span>
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Selected Attachment Preview */}
          {selectedImage && (
            <div className="px-4 py-2 bg-slate-100 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <img src={selectedImage.url} alt="Attached preview" className="w-10 h-10 rounded-xl object-cover border-2 border-emerald-500" />
                <div className="text-xs">
                  <span className="font-bold text-slate-800 dark:text-slate-200 block">
                    {isUrdu ? 'تصویر تجزیہ کے لیے منسلک کی گئی ہے' : 'Photo Attached for AI Guidance'}
                  </span>
                  <span className="text-[10px] text-slate-500 block">
                    {isUrdu ? 'جلد کی کیفیت یا لیب رپورٹ پر جائزہ' : 'Ready for non-diagnostic AI analysis'}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedImage(null)}
                className="p-1.5 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500"
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </button>
            </div>
          )}

          {/* Bottom Chat Input Form */}
          <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="p-3 sm:p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 shrink-0">
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageSelect}
              accept="image/*"
              className="hidden"
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              title={isUrdu ? 'جلد یا رپورٹ کی تصویر بھیجیں' : 'Attach Skin photo or Lab Report image'}
            >
              <ImageIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </button>

            <button
              type="button"
              onClick={toggleListening}
              className={`p-3 rounded-2xl transition-all ${isListening ? 'bg-red-500 text-white animate-bounce' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'}`}
              title="Voice Input (مائیک استعمال کریں)"
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isUrdu ? 'یہاں اپنا سوال یا علامات ٹائپ کریں...' : 'Type symptoms, medicine query, doctor timings or questions...'}
              className="flex-1 p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />

            <button
              type="submit"
              disabled={(!input.trim() && !selectedImage) || isLoading}
              className="p-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold shadow-md transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>

          </form>

        </div>

      </div>
    </div>
  );
};
