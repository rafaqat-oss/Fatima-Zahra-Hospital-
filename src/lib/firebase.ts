import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  sendPasswordResetEmail,
  sendEmailVerification,
  updatePassword,
  updateProfile,
  deleteUser,
  reauthenticateWithCredential,
  EmailAuthProvider,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot 
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { UserProfile, Appointment, Doctor, Department, Patient, ChatMessage, FeedbackItem } from '../types';
import { initialDepartments, initialDoctors, initialFeedback } from '../data/initialData';

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);

// Initialize Firestore with specific databaseId if provided
export const db = firebaseConfig.firestoreDatabaseId 
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

// Seed initial collections if empty
export async function seedInitialFirestoreData() {
  try {
    // Seed Departments
    const deptRef = collection(db, 'departments');
    const deptSnap = await getDocs(deptRef);
    if (deptSnap.empty) {
      for (const dept of initialDepartments) {
        await setDoc(doc(db, 'departments', dept.id), dept);
      }
    }

    // Seed Doctors
    const docRef = collection(db, 'doctors');
    const docSnap = await getDocs(docRef);
    if (docSnap.empty) {
      for (const doctor of initialDoctors) {
        await setDoc(doc(db, 'doctors', doctor.id), doctor);
      }
    }

    // Seed Feedback
    const fbRef = collection(db, 'feedback');
    const fbSnap = await getDocs(fbRef);
    if (fbSnap.empty) {
      for (const fb of initialFeedback) {
        await setDoc(doc(db, 'feedback', fb.id), fb);
      }
    }
  } catch (error) {
    console.warn('Firestore seed note:', error);
  }
}

// Set Remember Me Persistence
export async function configureAuthPersistence(rememberMe: boolean) {
  try {
    await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
  } catch (e) {
    console.warn('Failed to set auth persistence:', e);
  }
}

// User Profile helpers
export async function createUserProfile(uid: string, profile: Partial<UserProfile>) {
  const userRef = doc(db, 'users', uid);
  const data: UserProfile = {
    uid,
    email: profile.email || '',
    displayName: profile.displayName || 'Patient',
    role: profile.role || 'patient',
    phone: profile.phone || '',
    createdAt: new Date().toISOString()
  };
  await setDoc(userRef, data, { merge: true });

  // If patient, also create in patients collection
  if (data.role === 'patient') {
    const patientRef = doc(db, 'patients', uid);
    await setDoc(patientRef, {
      id: uid,
      name: data.displayName,
      email: data.email,
      phone: data.phone || '',
      age: 30,
      gender: 'male',
      registeredAt: new Date().toISOString(),
      bloodGroup: 'B+'
    }, { merge: true });
  }

  return data;
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    const userRef = doc(db, 'users', uid);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      return snap.data() as UserProfile;
    }
  } catch (e) {
    console.warn('Failed to fetch user profile:', e);
  }
  return null;
}

// Update User Profile Data
export async function updateUserProfileData(uid: string, updates: { displayName?: string; phone?: string }) {
  const userRef = doc(db, 'users', uid);
  await updateDoc(userRef, updates);

  if (auth.currentUser && updates.displayName) {
    await updateProfile(auth.currentUser, { displayName: updates.displayName });
  }

  // Update in patients collection if patient
  try {
    const patientRef = doc(db, 'patients', uid);
    const snap = await getDoc(patientRef);
    if (snap.exists()) {
      await updateDoc(patientRef, {
        name: updates.displayName || snap.data().name,
        phone: updates.phone || snap.data().phone
      });
    }
  } catch (e) {
    console.warn('Patient collection sync note:', e);
  }
}

// Send Email Verification
export async function triggerEmailVerification() {
  if (auth.currentUser) {
    await sendEmailVerification(auth.currentUser);
  } else {
    throw new Error('No user is currently signed in.');
  }
}

// Change Password
export async function changeUserPassword(currentPassword?: string, newPassword?: string) {
  const currentUser = auth.currentUser;
  if (!currentUser) throw new Error('No user is currently signed in.');
  if (!newPassword) throw new Error('New password is required.');

  if (currentPassword && currentUser.email) {
    const credential = EmailAuthProvider.credential(currentUser.email, currentPassword);
    await reauthenticateWithCredential(currentUser, credential);
  }

  await updatePassword(currentUser, newPassword);
}

// Delete Account
export async function deleteUserAccount(uid: string, password?: string) {
  const currentUser = auth.currentUser;
  if (currentUser) {
    if (password && currentUser.email) {
      try {
        const credential = EmailAuthProvider.credential(currentUser.email, password);
        await reauthenticateWithCredential(currentUser, credential);
      } catch (e) {
        console.warn('Reauth warning:', e);
      }
    }
    await deleteDoc(doc(db, 'users', uid));
    try {
      await deleteDoc(doc(db, 'patients', uid));
    } catch (e) {
      // Ignore if not present
    }
    await deleteUser(currentUser);
  } else if (uid.startsWith('demo-')) {
    // Demo user clean up
    return true;
  } else {
    throw new Error('No active authenticated session.');
  }
}

// Appointment Firestore helpers
export async function createAppointment(appointment: Omit<Appointment, 'id' | 'createdAt'>): Promise<string> {
  const newId = 'apt-' + Date.now();
  const fullAppointment: Appointment = {
    ...appointment,
    id: newId,
    createdAt: new Date().toISOString()
  };
  try {
    await setDoc(doc(db, 'appointments', newId), fullAppointment);
  } catch (e) {
    console.warn('Firestore set doc error, using client state:', e);
  }
  return newId;
}

export async function fetchAppointments(userRole?: string, userId?: string): Promise<Appointment[]> {
  try {
    const apptsRef = collection(db, 'appointments');
    const snap = await getDocs(apptsRef);
    const list: Appointment[] = [];
    snap.forEach((doc) => {
      list.push(doc.data() as Appointment);
    });
    if (userRole === 'patient' && userId) {
      return list.filter(a => a.patientId === userId);
    }
    if (userRole === 'doctor' && userId) {
      return list.filter(a => a.doctorId === userId);
    }
    return list;
  } catch (e) {
    console.warn('Firestore fetch appointments error:', e);
    return [];
  }
}

export async function updateAppointmentStatus(appointmentId: string, status: Appointment['status']) {
  try {
    const ref = doc(db, 'appointments', appointmentId);
    await updateDoc(ref, { status });
  } catch (e) {
    console.warn('Failed updating appointment in firestore:', e);
  }
}

// Save Chat Messages
export async function saveChatMessage(userId: string, message: Omit<ChatMessage, 'id'>) {
  try {
    const msgRef = collection(db, 'messages');
    await addDoc(msgRef, {
      ...message,
      userId,
      timestamp: new Date().toISOString()
    });
  } catch (e) {
    console.warn('Failed to save message:', e);
  }
}

// Save Feedback
export async function submitFeedback(feedback: Omit<FeedbackItem, 'id' | 'date'>) {
  const id = 'fb-' + Date.now();
  const item: FeedbackItem = {
    ...feedback,
    id,
    date: new Date().toISOString().split('T')[0]
  };
  try {
    await setDoc(doc(db, 'feedback', id), item);
  } catch (e) {
    console.warn('Failed to submit feedback to firestore:', e);
  }
  return item;
}
