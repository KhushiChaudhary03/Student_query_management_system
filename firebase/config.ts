import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCojLBEpQtrXAxDcwkteEdzi8BJnaPqiwY",
  authDomain: "campusquery-a861c.firebaseapp.com",
  projectId: "campusquery-a861c",
  storageBucket: "campusquery-a861c.firebasestorage.app",
  messagingSenderId: "883800519141",
  appId: "1:883800519141:web:370c403b661622921d7f0c"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
