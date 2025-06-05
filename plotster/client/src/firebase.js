// src/firebase.js
// -----------------------
// fun firebase config yay

import { initializeApp } from "firebase/app";
import { getDatabase, connectDatabaseEmulator } from "firebase/database";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// https://firebase.google.com/docs/web/setup#available-libraries


// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyATKFs8XQEBYAtmNToFYYOaoiLVko17Tbo",
  authDomain: "plotster.firebaseapp.com",
  projectId: "plotster",
  storageBucket: "plotster.firebasestorage.app",
  messagingSenderId: "675873798496",
  appId: "1:675873798496:web:387c8ee35dce3834f18605",
  measurementId: "G-168CQFFG14"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const storage = getStorage(app);
const db = getDatabase(app);

if (window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1") {
  connectDatabaseEmulator(db, "localhost", 9000);
}

export default db;