// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";  // Import Firestore

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyACxdztmSJ6MP_l6tNr24KvrbBbgzZBQ1g",
  authDomain: "davmed-c7d4d.firebaseapp.com",
  projectId: "davmed-c7d4d",
  storageBucket: "davmed-c7d4d.appspot.com",
  messagingSenderId: "784007901288",
  appId: "1:784007901288:web:ea4319d574e9ca71ed4bdd",
  measurementId: "G-9DW5MRHXRE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Firestore instance
const db = getFirestore(app);  // Initialize Firestore

// Export the Firestore instance (db)
export { db };

// You can also export the app itself if needed for other parts of the app
export default app;
