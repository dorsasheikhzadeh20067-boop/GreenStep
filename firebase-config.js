// مقادیر firebaseConfig را از Firebase Console (Project settings ← Your apps ← Web app) جایگزین کن.
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { initializeFirestore, persistentLocalCache } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBnO5kkvN-Otq87G1KOT_EwCpmOIl0EK1c",
  authDomain: "greenstep-d9779.firebaseapp.com",
  projectId: "greenstep-d9779",
  storageBucket: "greenstep-d9779.firebasestorage.app",
  messagingSenderId: "306736904990",
  appId: "1:306736904990:web:edcaf8460a929ade7aa70f"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = initializeFirestore(app, { localCache: persistentLocalCache() }); // کار آفلاین + همگام‌سازی بعدی

export { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
export { doc, getDoc, setDoc, collection, query, orderBy, limit, onSnapshot, addDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";