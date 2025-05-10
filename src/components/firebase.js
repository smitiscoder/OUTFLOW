// src/components/firebase.js
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import {
  getAuth,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateEmail,
  updateProfile,
  updatePhoneNumber,
  PhoneAuthProvider,
  RecaptchaVerifier,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getMessaging } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: 'AIzaSyDIXQawm6JNyxwt1UnEH8rZhzYyYWhEWYg',
  authDomain: 'expensetracking-73767.firebaseapp.com',
  projectId: 'expensetracking-73767',
  storageBucket: 'expensetracking-73767.appspot.com',
  messagingSenderId: '433052728459',
  appId: '1:433052728459:web:98ef488a9bcd471f58688e',
  measurementId: 'G-4CD1QW7VWT',
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

// Google Auth
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('profile');
googleProvider.addScope('email');
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Firestore & Messaging
const db = getFirestore(app);
const messaging = getMessaging(app);

// Export everything needed
export {
  app,
  auth,
  googleProvider,
  db,
  messaging,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateEmail,
  updateProfile,
  updatePhoneNumber,
  PhoneAuthProvider,
  RecaptchaVerifier,
};

export default app;