/* ===========================================
   SURIYA ELECTRICAL
   firebase.js
=========================================== */

// Firebase App
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

// Firestore
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

// Authentication
import { getAuth } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

// Storage
import { getStorage } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-storage.js";


// Firebase Configuration
const firebaseConfig = {

  apiKey: "AIzaSyCKA5UzgrWDto445SieJyK60avHG2H8c70",

  authDomain: "suriya-electrical-87a3d.firebaseapp.com",

  projectId: "suriya-electrical-87a3d",

  storageBucket: "suriya-electrical-87a3d.firebasestorage.app",

  messagingSenderId: "452677637789",

  appId: "1:452677637789:web:9e4d8a4e732b1d4f6fa674",

  measurementId: "G-46L80QZS2P"

};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Services
const db = getFirestore(app);

const auth = getAuth(app);

const storage = getStorage(app);

// Export
export { app, db, auth, storage };
