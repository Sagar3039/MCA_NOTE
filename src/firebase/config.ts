
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAW72by3_bkdIyg40kIz10Kj-BXaxpiQQ0",
  authDomain: "studio-815054631-d75c7.firebaseapp.com",
  projectId: "studio-815054631-d75c7",
  storageBucket: "studio-815054631-d75c7.firebasestorage.app",
  messagingSenderId: "327906201961",
  appId: "1:327906201961:web:f318d8bc30ac662d832df8"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Export Firestore DB (THIS WAS MISSING)
export const db = getFirestore(app);
