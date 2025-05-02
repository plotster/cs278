// src/firebase.js
// -----------------------
// fun firebase config yay

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase Storage (bc photos and stuff)
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
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// TODO: uncomment once we figure out the free credits for Firebase Blaze plan
// const storage = getStorage(app);