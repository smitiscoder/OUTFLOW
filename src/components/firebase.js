// Firebase core initialization
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';

// Firebase services
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

// Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyDIXQawm6JNyxwt1UnEH8rZhzYyYWhEWYg',
  authDomain: 'expensetracking-73767.firebaseapp.com',
  projectId: 'expensetracking-73767',
  storageBucket: 'expensetracking-73767.appspot.com',
  messagingSenderId: '433052728459',
  appId: '1:433052728459:web:98ef488a9bcd471f58688e',
  measurementId: 'G-4CD1QW7VWT',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Firebase Auth setup
const auth = getAuth(app);

// Google Auth Provider setup
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('profile');
googleProvider.addScope('email');
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

// Firestore setup
const db = getFirestore(app);

// Exporting Firebase services for use in app
export {
  auth,
  googleProvider,
  db,
  updateEmail,
  updateProfile,
  updatePhoneNumber,
  PhoneAuthProvider,
  RecaptchaVerifier,
};

export default app;




