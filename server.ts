import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Lazy initializer for Gemini AI Client
  const getAIClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return null;
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  };

  // System Instruction for Hospital Chatbot
  const SYSTEM_INSTRUCTION = `
You are the Advanced AI Virtual Medical & Health Assistant for Fatima Zahra Hospital in Ranewal Syedan, District Gujrat, Punjab, Pakistan (Near Fruit Mandi).
Founded in memory of the late Syed Muzammil Shah and managed by Syed Mujahid Hussain Shah alongside local trustees.

Hospital Details:
- Name: Fatima Zahra Hospital (فاطمہ زہرہ ہسپتال)
- Address: Near Fruit Mandi, Ranewal Syedan, District Gujrat, Punjab, Pakistan
- Emergency Phone: +92 336 1992199
- Core Facilities: 24/7 Emergency Ward, Outpatient Department (OPD), Maternity & Delivery Suites, Pathology Lab, Subsidized Dispensary, Blood Bank, Ambulance Service.

Consultant Doctors & Departments:
- Dr. Syed Mujahid Hussain Shah: Senior Medical Officer & Admin (Emergency & General OPD)
- Dr. Zahra Batool: Consultant Gynecologist & Obstetrician (Maternity & Women Care)
- Dr. Ali Raza: Consultant Pediatrician (Child Specialist)
- Dr. Sadia Noreen: General Physician (OPD)
- Dr. Muhammad Imran: General Surgeon & Pathologist
- Dr. Tariq Mahmood: Consultant Cardiologist (Heart Care)
- Dr. Humaira Khan: Consultant Dermatologist (Skin Care)
- Dr. Usman Ghani: Consultant Orthopedic Surgeon (Bones & Joints)
- Dr. Ayesha Siddiqui: Consultant ENT Specialist (Ear, Nose, Throat)

RESPONSE STRUCTURE FOR SYMPTOMS & HEALTH QUERIES:
When a patient describes symptoms (e.g., fever, skin rash, joint pain, cough, digestive upset):
1. ASK 1-2 CLARIFYING FOLLOW-UP QUESTIONS (e.g. onset, duration, severity, patient age).
2. EDUCATIONAL INFORMATION: Explain common symptoms, possible causes, prevention tips, and self-care measures.
3. OTC MEDICINE GUIDANCE (IF RELEVANT): Provide general educational info about common over-the-counter drugs (e.g., Paracetamol for mild pain/fever, ORS for dehydration, Antacids for acid reflux). State their general purpose, usual precautions, and common side effects. STRIKTLY NO DOSAGES, SPECIFIC FREQUENCY, OR PRESCRIPTION-ONLY MEDICATIONS!
4. RECOMMENDED DEPARTMENT & SPECIALIST: Clearly name the recommended department (e.g. Dermatology, Cardiology, Pediatrics, Gynecologist, Orthopedics, ENT, General Physician) and suggested specialist at Fatima Zahra Hospital.
5. WHEN TO SEE A DOCTOR: Explicitly list warning signs that require immediate doctor consultation.

MANDATORY SAFETY RULES & MEDICAL COMPLIANCE:
1. NEVER DIAGNOSE OR PRESCRIBE: You MUST NEVER diagnose diseases or prescribe specific medicines/dosages.
2. ALWAYS DISPLAY DISCLAIMER: End EVERY response with:
   "This AI assistant provides educational information only. Please consult a qualified doctor for diagnosis and treatment."
   (Urdu version: "یہ چیٹ بوٹ صرف تعلیمی معلومات فراہم کرتا ہے۔ براہ کرم تشخیص یا علاج کے لیے کسی مستند ڈاکٹر سے رجوع کریں۔")
3. EMERGENCY RED ALERT PROTOCOL:
   If the user reports chest pain, severe difficulty breathing, stroke signs (face drooping, weakness), severe bleeding, seizures, unconsciousness, poisoning, or acute trauma:
   - State in bold urgent text: "🚨 EMERGENCY ALERT: SEEK IMMEDIATE MEDICAL CARE!"
   - Instruct them to visit Fatima Zahra Hospital 24/7 Emergency Ward in Ranewal Syedan immediately or call emergency hotline +92 336 1992199.
4. LANGUAGE: Respond in fluent English or Urdu based on user prompt or language setting.
`;

  // API Health Check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', hospital: 'Fatima Zahra Hospital', location: 'Ranewal Syedan, Gujrat', model: 'gemini-3.6-flash' });
  });

  // AI Chatbot Route
  app.post('/api/chat', async (req, res) => {
    try {
      const { message, language = 'en', history = [], image = null } = req.body;

      if ((!message || typeof message !== 'string') && !image) {
        res.status(400).json({ error: 'Message string or image attachment is required' });
        return;
      }

      // Check for high-urgency emergency trigger words
      const lowerMsg = (message || '').toLowerCase();
      const emergencyKeywords = [
        'chest pain', 'heart attack', 'breathing difficulty', 'cannot breathe',
        'shortness of breath', 'stroke', 'unconscious', 'fainted', 'severe bleeding',
        'poison', 'seizure', 'stiff neck', 'سینے میں درد', 'سانس میں تکلیف', 'سانس کا رکنا',
        'شدید خون', 'بے ہوشی', 'فالج', 'زہر'
      ];

      const isEmergency = emergencyKeywords.some(keyword => lowerMsg.includes(keyword));

      const ai = getAIClient();

      const mandatoryDisclaimerEn = "\n\nThis chatbot provides educational information only. Please consult a qualified doctor for diagnosis or treatment.";
      const mandatoryDisclaimerUr = "\n\nیہ چیٹ بوٹ صرف تعلیمی معلومات فراہم کرتا ہے۔ براہ کرم تشخیص یا علاج کے لیے کسی مستند ڈاکٹر سے رجوع کریں۔";
      const disclaimerToAppend = language === 'ur' ? mandatoryDisclaimerUr : mandatoryDisclaimerEn;

      if (!ai) {
        // Safe fallback response if API key is not set
        let fallbackText = language === 'ur'
          ? 'فاطمہ زہرہ ہسپتال رانیوال سیداں، گجرات کے طبی معاون میں خوش آمدید۔ آپ ہماری او پی ڈی، میٹرنٹی وارڈ یا ایمرجنسی سروسز کے لیے +92 336 1992199 پر رابطہ کر سکتے ہیں۔'
          : 'Welcome to Fatima Zahra Hospital Ranewal Syedan, Gujrat. For appointments, OPD schedules, or urgent care, please call +92 336 1992199.';

        if (isEmergency) {
          fallbackText = language === 'ur'
            ? '🚨 **ایمرجنسی الرٹ**: اگر آپ کو شدید درد، سانس کی تکلیف یا ایمرجنسی علامات ہیں تو فوراً فاطمہ زہرہ ہسپتال ایمرجنسی وارڈ رانیوال سیداں پہنچیں یا رابطہ کریں: +92 336 1992199'
            : '🚨 **EMERGENCY WARNING**: If you or the patient are experiencing chest pain, severe breathing difficulty, or emergency symptoms, please visit Fatima Zahra Hospital Emergency Ward near Fruit Mandi, Ranewal Syedan immediately or call +92 336 1992199!';
        }

        res.json({
          reply: fallbackText + disclaimerToAppend,
          isEmergency,
          language
        });
        return;
      }

      // Sanitize chat history so it starts with 'user' and alternates roles cleanly
      const sanitizedHistory: Array<{ role: 'user' | 'model'; parts: Array<any> }> = [];

      if (Array.isArray(history)) {
        for (const item of history) {
          if (!item || !item.parts || !Array.isArray(item.parts) || !item.parts[0]?.text) continue;
          const role = item.role === 'user' ? 'user' : 'model';
          const text = String(item.parts[0].text).trim();
          if (!text) continue;

          // Must start history with 'user'
          if (sanitizedHistory.length === 0 && role !== 'user') {
            continue;
          }

          // Avoid consecutive identical roles
          if (sanitizedHistory.length > 0 && sanitizedHistory[sanitizedHistory.length - 1].role === role) {
            continue;
          }

          sanitizedHistory.push({
            role,
            parts: [{ text }]
          });
        }
      }

      // Remove trailing 'user' from history if present before adding current message
      if (sanitizedHistory.length > 0 && sanitizedHistory[sanitizedHistory.length - 1].role === 'user') {
        sanitizedHistory.pop();
      }

      const userPromptText = `[User Language Context: ${language === 'ur' ? 'Urdu (اردو)' : 'English'}]\n${message || 'Please analyze this attached medical/report image or photo and provide general educational information.'}`;

      const userParts: any[] = [{ text: userPromptText }];
      if (image && image.data && image.mimeType) {
        userParts.push({
          inlineData: {
            mimeType: image.mimeType,
            data: image.data
          }
        });
      }

      const contents = [
        ...sanitizedHistory,
        { role: 'user', parts: userParts }
      ];

      // Call Gemini model
      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.2,
          maxOutputTokens: 1000,
        }
      });

      let replyText = response.text || (language === 'ur' ? 'فاطمہ زہرہ ہسپتال میں رابطہ کرنے کا شکریہ۔' : 'Thank you for reaching out to Fatima Zahra Hospital.');

      // Enforce mandatory disclaimer in generated text if missing
      const hasDisclaimer = replyText.includes('educational information only') || replyText.includes('تعلیمی معلومات');
      if (!hasDisclaimer) {
        replyText += disclaimerToAppend;
      }

      res.json({
        reply: replyText,
        isEmergency,
        language
      });
    } catch (error: any) {
      console.error('Gemini Chat Error:', error);

      const isUrdu = req.body?.language === 'ur';
      const fallbackErrorMsg = isUrdu
        ? 'ہمیں معذرت ہے، AI معاون فی الوقت جواب دینے میں تاخیر کا شکار ہے۔ براہ کرم فاطمہ زہرہ ہسپتال کی ہیلپ لائن +92 336 1992199 پر رابطہ کریں۔\n\nیہ چیٹ بوٹ صرف تعلیمی معلومات فراہم کرتا ہے۔ براہ کرم تشخیص یا علاج کے لیے کسی مستند ڈاکٹر سے رجوع کریں۔'
        : 'Our AI Assistant is currently experiencing high demand. For immediate medical guidance or appointments, please call Fatima Zahra Hospital at +92 336 1992199.\n\nThis chatbot provides educational information only. Please consult a qualified doctor for diagnosis or treatment.';

      res.json({
        reply: fallbackErrorMsg,
        isEmergency: false,
        language: req.body?.language || 'en'
      });
    }
  });

  // Serve Vite in development / Static bundle in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Fatima Zahra Hospital server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
