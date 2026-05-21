// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "YOURAPIKEY",
  authDomain: "YOURAUTHDOMAIN",
  projectId: "YOURPROJECTID",
  storageBucket: "XXXXXX-XXXX.XXXXXXX.app",
  messagingSenderId: "XXXXXXXX",
  appId: "XXXXXXXXXXXXXXXXXXX",
  measurementId: "XXXXXXXXX"
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
