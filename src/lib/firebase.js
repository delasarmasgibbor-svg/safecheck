import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBcWj7lWUQI7W00Fsbt6GmZGxsJa8Trxm4",
  authDomain: "accommodation-project-b11e8.firebaseapp.com",
  projectId: "accommodation-project-b11e8",
  storageBucket: "accommodation-project-b11e8.firebasestorage.app",
  messagingSenderId: "462119206324",
  appId: "1:462119206324:web:10072b8c97fc7ffb8206e1",
  measurementId: "G-SG20JSSKE5"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;
