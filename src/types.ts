export type UserRole = 'patient' | 'doctor' | 'admin';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  phone?: string;
  createdAt?: string;
}

export interface Doctor {
  id: string;
  name: string;
  departmentId: string;
  departmentName: string;
  specialization: string;
  phone: string;
  email: string;
  availableDays: string[];
  availableHours: string;
  roomNo: string;
  fee: string;
  rating: number;
  experience: string;
  status: 'active' | 'on_leave';
  image?: string;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  phone: string;
  email: string;
  medicalHistory?: string;
  registeredAt: string;
  bloodGroup: string;
}

export interface Department {
  id: string;
  name: string;
  urduName: string;
  description: string;
  headDoctor: string;
  services: string[];
  location: string;
  icon: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  patientAge?: number;
  doctorId: string;
  doctorName: string;
  departmentId: string;
  departmentName: string;
  date: string;
  timeSlot: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: string;
  fee: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  language: 'en' | 'ur';
  timestamp: string;
  isEmergency?: boolean;
}

export interface FeedbackItem {
  id: string;
  name: string;
  rating: number;
  category: string;
  comment: string;
  date: string;
}

export interface HospitalInfo {
  name: string;
  urduName: string;
  location: string;
  phone: string;
  contactPerson: string;
  founder: string;
  managedBy: string;
  emergencyHotline: string;
}

export interface Prescription {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  diagnosis: string;
  medicines: Array<{
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
  }>;
  advice?: string;
  followUpDate?: string;
}

export interface LabReport {
  id: string;
  patientId: string;
  patientName: string;
  testName: string;
  category: string;
  date: string;
  doctorName: string;
  status: 'pending' | 'ready';
  summary?: string;
  downloadUrl?: string;
}

export interface BedCategory {
  id: string;
  wardName: string;
  urduName: string;
  totalBeds: number;
  availableBeds: number;
  location: string;
  dailyCharge: string;
}

export interface AmbulanceBooking {
  id: string;
  patientName: string;
  phone: string;
  pickupAddress: string;
  urgency: 'critical' | 'urgent' | 'routine';
  status: 'dispatched' | 'en_route' | 'completed';
  driverName: string;
  eta: string;
}

export interface MedicineItem {
  id: string;
  name: string;
  formula: string;
  category: string;
  inStock: boolean;
  stockCount: number;
  price: string;
  isWelfareFree: boolean;
}

export interface BloodGroupStock {
  group: string;
  bags: number;
  status: 'available' | 'low' | 'critical';
}

export interface MedicineReminder {
  id: string;
  medicineName: string;
  dosage: string;
  time: string;
  takenToday: boolean;
  type: 'medicine' | 'vaccine';
}
