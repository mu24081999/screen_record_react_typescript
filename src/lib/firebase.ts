import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCm5QRkPzS7Wi6QG8ugcEk6fK1bjxYqSAI",
  authDomain: "screenrecorder-57498.firebaseapp.com",
  projectId: "screenrecorder-57498",
  storageBucket: "screenrecorder-57498.firebasestorage.app",
  messagingSenderId: "1083065495985",
  appId: "1:1083065495985:web:5bd1a9232b691c113c4d90"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth
export const auth = getAuth(app);

// Configure Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Optional: Add scopes if needed
googleProvider.addScope('https://www.googleapis.com/auth/userinfo.email');
googleProvider.addScope('https://www.googleapis.com/auth/userinfo.profile');