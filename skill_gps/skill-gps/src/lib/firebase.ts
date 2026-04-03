// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCC0T_dKNSWvILxlkf5Ef4L6A8JwTwPV0I",
  authDomain: "skillgps-e2f75.firebaseapp.com",
  projectId: "skillgps-e2f75",
  storageBucket: "skillgps-e2f75.firebasestorage.app",
  messagingSenderId: "208360142427",
  appId: "1:208360142427:web:ea3f9f5d28926444d2317e",
  measurementId: "G-SWX8ZN6P81"
};

// Initialize Firebase using singleton pattern to prevent re-initialization in Next.js
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

// Enable local persistence so signed-in state is remembered between page reloads
if (typeof window !== "undefined") {
    setPersistence(auth, browserLocalPersistence).catch(console.error);
}

export { app, db, auth, storage };
