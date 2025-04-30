// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  updateEmail,
  updateProfile,
  updatePhoneNumber,
  PhoneAuthProvider,
  RecaptchaVerifier,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyDIXQawm6JNyxwt1UnEH8rZhzYyYWhEWYg',
  authDomain: 'expensetracking-73767.firebaseapp.com',
  projectId: 'expensetracking-73767',
  storageBucket: 'expensetracking-73767.firebasestorage.app',
  messagingSenderId: '433052728459',
  appId: '1:433052728459:web:98ef488a9bcd471f58688e',
  measurementId: 'G-4CD1QW7VWT',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Set up authentication and Firestore services
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);

// ✅ Export update utilities for user profile management
export {
  updateEmail,
  updateProfile,
  updatePhoneNumber,
  PhoneAuthProvider,
  RecaptchaVerifier,
};

export default app;



