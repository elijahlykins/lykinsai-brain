// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB7pW-_LAYkUJlTSxlrf7ZAfzn6fMynEtY",
  authDomain: "lykinsai-software.firebaseapp.com",
  projectId: "lykinsai-software",
  storageBucket: "lykinsai-software.firebasestorage.app",
  messagingSenderId: "653761052573",
  appId: "1:653761052573:web:a0228e4b96de520214b974",
  measurementId: "G-ECF0L3C25W",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
