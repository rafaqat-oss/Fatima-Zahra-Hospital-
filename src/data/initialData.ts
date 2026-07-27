import { Department, Doctor, HospitalInfo, FeedbackItem } from '../types';

export const hospitalDetails: HospitalInfo = {
  name: 'Fatima Zahra Hospital',
  urduName: 'فاطمہ زہرہ ہسپتال',
  location: 'Near Fruit Mandi, Ranewal Syedan, District Gujrat, Punjab, Pakistan',
  phone: '+92 336 1992199',
  contactPerson: 'Syed Mujahid Hussain Shah',
  founder: 'Late Syed Muzammil Shah',
  managedBy: 'Local Donors, Trustees & Management Committee',
  emergencyHotline: '+92 336 1992199'
};

export const initialDepartments: Department[] = [
  {
    id: 'dept-emergency',
    name: 'Emergency & Trauma Care',
    urduName: 'ایمرجنسی و حادثاتی شعبہ',
    description: '24/7 urgent care and triage unit for acute medical conditions and trauma handling.',
    headDoctor: 'Dr. Syed Mujahid Hussain Shah',
    services: ['24/7 Triage', 'Acute Trauma Care', 'Oxygen Therapy', 'Emergency Minor Procedures', 'Vitals Stabilization'],
    location: 'Ground Floor, Block A',
    icon: 'Activity'
  },
  {
    id: 'dept-opd',
    name: 'Outpatient Department (OPD)',
    urduName: 'بیرونی مریضوں کا شعبہ (او پی ڈی)',
    description: 'Comprehensive outpatient medical consultation across general health, medicine, and wellness.',
    headDoctor: 'Dr. Sadia Noreen',
    services: ['General Physician Consultation', 'Routine Health Screening', 'Prescription & Follow-up', 'Chronic Disease Management'],
    location: 'Ground Floor, OPD Wing',
    icon: 'Stethoscope'
  },
  {
    id: 'dept-maternity',
    name: 'Maternity & Labor Ward',
    urduName: 'زنانہ و زچگی کا شعبہ',
    description: 'Dedicated maternal health, antenatal care, delivery suites, and post-natal care for mothers and infants.',
    headDoctor: 'Dr. Zahra Batool',
    services: ['Antenatal & Postnatal Clinics', 'Normal & C-Section Delivery Support', 'Fetal Monitoring', 'Female Medical Ward Access'],
    location: '1st Floor, Maternity Block',
    icon: 'HeartHandshake'
  },
  {
    id: 'dept-pediatrics',
    name: 'Pediatrics & Child Care',
    urduName: 'اطفال و بچوں کا شعبہ',
    description: 'Specialized healthcare for infants, young children, and adolescents.',
    headDoctor: 'Dr. Ali Raza',
    services: ['Child Immunization & Vaccination', 'Pediatric OPD', 'Growth Monitoring', 'Infant Care Guidance'],
    location: '1st Floor, Wing B',
    icon: 'Baby'
  },
  {
    id: 'dept-lab',
    name: 'Laboratory & Dispensary',
    urduName: 'لیبارٹری و ادویات',
    description: 'Diagnostic blood tests, pathology services, and subsidized pharmacy for needy patients.',
    headDoctor: 'Dr. Muhammad Imran',
    services: ['Complete Blood Count (CBC)', 'Blood Glucose & Liver Tests', 'Subsidized Medicine Dispensary', 'Urine Analysis'],
    location: 'Ground Floor, Annex',
    icon: 'FlaskConical'
  },
  {
    id: 'dept-wards',
    name: 'Inpatient Wards (Male & Female)',
    urduName: 'ان ڈور میڈیکل وارڈز',
    description: 'Clean, supervised inpatient beds for male and female patients requiring hospital stay.',
    headDoctor: 'Dr. Syed Mujahid Hussain Shah',
    services: ['Male Medical Ward', 'Female Medical Ward', '24/7 Nursing Supervision', 'Welfare Patient Assistance'],
    location: '2nd Floor, Main Building',
    icon: 'BedDouble'
  }
];

export const initialDoctors: Doctor[] = [
  {
    id: 'doc-1',
    name: 'Dr. Syed Mujahid Hussain Shah',
    departmentId: 'dept-emergency',
    departmentName: 'Emergency & General Medicine',
    specialization: 'Senior Medical Officer & Hospital Administrator',
    phone: '+92 336 1992199',
    email: 'mujahid.shah@fatimazahrahospital.org',
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    availableHours: '09:00 AM - 05:00 PM',
    roomNo: 'Room 101 (Admin / ER)',
    fee: 'Welfare (Free / Optional Charity)',
    rating: 4.9,
    experience: '18+ Years',
    status: 'active'
  },
  {
    id: 'doc-2',
    name: 'Dr. Zahra Batool',
    departmentId: 'dept-maternity',
    departmentName: 'Maternity & Gynecology',
    specialization: 'Consultant Gynecologist & Obstetrician',
    phone: '+92 336 1992199',
    email: 'zahra.batool@fatimazahrahospital.org',
    availableDays: ['Monday', 'Wednesday', 'Friday', 'Saturday'],
    availableHours: '10:00 AM - 02:00 PM',
    roomNo: 'Room 203 (Maternity Wing)',
    fee: 'Welfare (Free / Optional Charity)',
    rating: 4.95,
    experience: '14+ Years',
    status: 'active'
  },
  {
    id: 'doc-3',
    name: 'Dr. Ali Raza',
    departmentId: 'dept-pediatrics',
    departmentName: 'Pediatrics & Child Care',
    specialization: 'Consultant Pediatrician',
    phone: '+92 336 1992199',
    email: 'ali.raza@fatimazahrahospital.org',
    availableDays: ['Tuesday', 'Thursday', 'Saturday'],
    availableHours: '11:00 AM - 04:00 PM',
    roomNo: 'Room 108 (Pediatric Ward)',
    fee: 'Welfare (Free / Optional Charity)',
    rating: 4.8,
    experience: '10+ Years',
    status: 'active'
  },
  {
    id: 'doc-4',
    name: 'Dr. Sadia Noreen',
    departmentId: 'dept-opd',
    departmentName: 'Outpatient Department (OPD)',
    specialization: 'General Physician & Women Health Specialist',
    phone: '+92 336 1992199',
    email: 'sadia.noreen@fatimazahrahospital.org',
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    availableHours: '09:00 AM - 03:00 PM',
    roomNo: 'Room 102 (OPD)',
    fee: 'Welfare (Free / Optional Charity)',
    rating: 4.88,
    experience: '8+ Years',
    status: 'active'
  },
  {
    id: 'doc-5',
    name: 'Dr. Muhammad Imran',
    departmentId: 'dept-lab',
    departmentName: 'General Surgery & Diagnostics',
    specialization: 'General Surgeon & Pathologist',
    phone: '+92 336 1992199',
    email: 'imran.surgeon@fatimazahrahospital.org',
    availableDays: ['Monday', 'Wednesday', 'Friday'],
    availableHours: '02:00 PM - 06:00 PM',
    roomNo: 'Room 105 (Procedure Suite)',
    fee: 'Welfare (Free / Optional Charity)',
    rating: 4.85,
    experience: '12+ Years',
    status: 'active'
  }
];

export const initialFeedback: FeedbackItem[] = [
  {
    id: 'fb-1',
    name: 'Chaudhry Ghulam Murtaza',
    rating: 5,
    category: 'Maternity Care',
    comment: 'Fatima Zahra Hospital provided exemplary care to my family. The staff in Ranewal Syedan are extremely dedicated and caring. Tribute to Late Syed Muzammil Shah.',
    date: '2026-06-15'
  },
  {
    id: 'fb-2',
    name: 'Nabila Kausar',
    rating: 5,
    category: 'Emergency & OPD',
    comment: 'The emergency team reacted immediately when we came from near Fruit Mandi. Free medicine dispensary was a huge relief for us.',
    date: '2026-07-02'
  },
  {
    id: 'fb-3',
    name: 'Muhammad Tariq Gujrat',
    rating: 5,
    category: 'Pediatric Care',
    comment: 'Dr. Ali Raza was very gentle with my son. The virtual assistant on this website also helped us book the exact time slot easily.',
    date: '2026-07-20'
  }
];

export const initialBeds = [
  { id: 'bed-1', wardName: '24/7 Emergency & Triage Ward', urduName: 'ایمرجنسی و ٹرییاژ وارڈ', totalBeds: 12, availableBeds: 5, location: 'Ground Floor, Block A', dailyCharge: 'Free Welfare' },
  { id: 'bed-2', wardName: 'Male General Medical Ward', urduName: 'مردانہ جنرل میڈیکل وارڈ', totalBeds: 20, availableBeds: 8, location: '2nd Floor, Wing A', dailyCharge: 'Free Welfare' },
  { id: 'bed-3', wardName: 'Female General Medical Ward', urduName: 'زنانہ جنرل میڈیکل وارڈ', totalBeds: 20, availableBeds: 6, location: '2nd Floor, Wing B', dailyCharge: 'Free Welfare' },
  { id: 'bed-4', wardName: 'Maternity & Delivery Suites', urduName: 'میٹرنٹی و زچگی وارڈ', totalBeds: 15, availableBeds: 4, location: '1st Floor, Maternity Block', dailyCharge: 'Free Welfare' },
  { id: 'bed-5', wardName: 'Intensive Care & Monitoring (ICU)', urduName: 'آئی سی یو وارڈ', totalBeds: 6, availableBeds: 2, location: '1st Floor, ICU Wing', dailyCharge: 'Subsidized' }
];

export const initialPharmacy = [
  { id: 'med-1', name: 'Paracetamol 500mg', formula: 'Acetaminophen', category: 'Analgesic & Antipyretic', inStock: true, stockCount: 1500, price: 'Rs. 0 (Free Welfare)', isWelfareFree: true },
  { id: 'med-2', name: 'Amoxicillin 500mg Capsule', formula: 'Amoxicillin Trihydrate', category: 'Antibiotic', inStock: true, stockCount: 850, price: 'Rs. 0 (Free Welfare)', isWelfareFree: true },
  { id: 'med-3', name: 'Omeprazole 20mg', formula: 'Proton Pump Inhibitor', category: 'Gastroenterology', inStock: true, stockCount: 1200, price: 'Rs. 0 (Free Welfare)', isWelfareFree: true },
  { id: 'med-4', name: 'Cefixime 400mg', formula: 'Cephalosporin Antibiotic', category: 'Antibiotic', inStock: true, stockCount: 400, price: 'Rs. 100 (Subsidized)', isWelfareFree: false },
  { id: 'med-5', name: 'Ibuprofen 400mg', formula: 'NSAID', category: 'Pain Relief & Anti-inflammatory', inStock: true, stockCount: 950, price: 'Rs. 0 (Free Welfare)', isWelfareFree: true },
  { id: 'med-6', name: 'Folic Acid & Iron Tablets', formula: 'Ferrous Sulfate + Folic Acid', category: 'Maternal Care', inStock: true, stockCount: 2000, price: 'Rs. 0 (Free Welfare)', isWelfareFree: true },
  { id: 'med-7', name: 'ORRS Rehydration Salts', formula: 'Oral Rehydration Salts', category: 'Pediatrics / Emergency', inStock: true, stockCount: 1800, price: 'Rs. 0 (Free Welfare)', isWelfareFree: true }
];

export const initialBloodBank = [
  { group: 'A+', bags: 14, status: 'available' },
  { group: 'B+', bags: 18, status: 'available' },
  { group: 'O+', bags: 22, status: 'available' },
  { group: 'AB+', bags: 6, status: 'low' },
  { group: 'A-', bags: 3, status: 'low' },
  { group: 'B-', bags: 2, status: 'critical' },
  { group: 'O-', bags: 4, status: 'low' },
  { group: 'AB-', bags: 1, status: 'critical' }
];

export const initialPrescriptions = [
  {
    id: 'rx-101',
    patientId: 'demo-patient-1',
    patientName: 'Muhammad Arshad',
    doctorId: 'doc-1',
    doctorName: 'Dr. Syed Mujahid Hussain Shah',
    date: '2026-07-22',
    diagnosis: 'Acute Upper Respiratory Tract Infection & Mild Fever',
    medicines: [
      { name: 'Paracetamol 500mg', dosage: '1 tablet', frequency: '3 times daily (8 hourly)', duration: '5 days' },
      { name: 'Amoxicillin 500mg', dosage: '1 capsule', frequency: '2 times daily after food', duration: '5 days' },
      { name: 'ORS Hydration Salt', dosage: '1 sachet in 1L water', frequency: 'As needed for hydration', duration: '3 days' }
    ],
    advice: 'Drink warm water, take complete rest, avoid cold beverages.',
    followUpDate: '2026-07-28'
  },
  {
    id: 'rx-102',
    patientId: 'demo-patient-1',
    patientName: 'Muhammad Arshad',
    doctorId: 'doc-2',
    doctorName: 'Dr. Zahra Batool',
    date: '2026-07-10',
    diagnosis: 'Routine Antenatal Care & Micronutrient Supplementation',
    medicines: [
      { name: 'Folic Acid + Iron 400mcg', dosage: '1 tablet', frequency: 'Once daily after breakfast', duration: '30 days' },
      { name: 'Calcium + Vit D3', dosage: '1 tablet', frequency: 'Once daily after dinner', duration: '30 days' }
    ],
    advice: 'Maintain nutritious diet, walk 20 mins daily, report any severe abdominal discomfort.',
    followUpDate: '2026-08-10'
  }
];

export const initialLabReports = [
  {
    id: 'lab-201',
    patientId: 'demo-patient-1',
    patientName: 'Muhammad Arshad',
    testName: 'Complete Blood Count (CBC) with ESR',
    category: 'Hematology',
    date: '2026-07-22',
    doctorName: 'Dr. Muhammad Imran',
    status: 'ready',
    summary: 'Hemoglobin: 13.8 g/dL (Normal), WBC Count: 7,800 /uL (Normal), Platelets: 260,000 /uL (Normal). No signs of acute bacterial infection.',
    downloadUrl: '#'
  },
  {
    id: 'lab-202',
    patientId: 'demo-patient-1',
    patientName: 'Muhammad Arshad',
    testName: 'Fasting Blood Sugar & HbA1c',
    category: 'Biochemistry',
    date: '2026-07-15',
    doctorName: 'Dr. Sadia Noreen',
    status: 'ready',
    summary: 'Fasting Glucose: 92 mg/dL (Normal range < 100 mg/dL), HbA1c: 5.4% (Non-diabetic range). Excellent metabolic control.',
    downloadUrl: '#'
  }
];

export const initialReminders = [
  { id: 'rem-1', medicineName: 'Paracetamol 500mg', dosage: '1 Tablet', time: '08:00 AM', takenToday: true, type: 'medicine' },
  { id: 'rem-2', medicineName: 'Folic Acid & Iron', dosage: '1 Tablet after lunch', time: '02:00 PM', takenToday: false, type: 'medicine' },
  { id: 'rem-3', medicineName: 'Child Polio & Hepatitis B Booster', dosage: 'Pediatric Clinic Visit', time: '04:00 PM', takenToday: false, type: 'vaccine' }
];
