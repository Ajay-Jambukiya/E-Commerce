import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDaASjGUMWFcAo-g1JCkouyaCDuIZPTuWM",
  authDomain: "e-commerce-ed317.firebaseapp.com",
  projectId: "e-commerce-ed317",
  storageBucket: "e-commerce-ed317.appspot.com",
  messagingSenderId: "1070753820438",
  appId: "1:1070753820438:web:955320820b956221972a37",
  measurementId: "G-YFGS9BV4B8",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// for use in every page of web
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);
export default app;
