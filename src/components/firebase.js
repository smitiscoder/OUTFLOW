// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';  // For Google authentication
import { getFirestore } from 'firebase/firestore';  // For Firestore database
import { getAnalytics } from 'firebase/analytics';  // For Firebase analytics

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
export const googleProvider = new GoogleAuthProvider(); // Google authentication provider
export const db = getFirestore(app);  // Firestore database reference

// If you want to export Firebase app instance
export default app;


