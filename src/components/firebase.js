// firebase.js
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  updateEmail,
  updateProfile,
  updatePhoneNumber,
  PhoneAuthProvider,
  RecaptchaVerifier
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, isSupported as isAnalyticsSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: 'AIzaSyDIXQawm6JNyxwt1UnEH8rZhzYyYWhEWYg',
  authDomain: 'expensetracking-73767.firebaseapp.com',
  projectId: 'expensetracking-73767',
  storageBucket: 'expensetracking-73767.appspot.com',
  messagingSenderId: '433052728459',
  appId: '1:433052728459:web:98ef488a9bcd471f58688e',
  measurementId: 'G-4CD1QW7VWT'
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Analytics (conditionally for SSR or unsupported browsers)
let analytics;
isAnalyticsSupported().then((supported) => {
  if (supported) {
    analytics = getAnalytics(app);
  }
});

// Initialize Auth
const auth = getAuth(app);

// Setup Google Auth Provider
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account' // Always prompt user to choose account
});
googleProvider.addScope('profile');
googleProvider.addScope('email');

// Initialize Firestore
const db = getFirestore(app);

// Export services and utilities
export {
  app,
  auth,
  db,
  googleProvider,
  updateEmail,
  updateProfile,
  updatePhoneNumber,
  PhoneAuthProvider,
  RecaptchaVerifier,
  analytics
};



