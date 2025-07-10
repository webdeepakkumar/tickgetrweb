// app/(Api)/firebase/firebase.js

// Import the functions you need from the SDKs
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyD3T8JTlXwXkE7U6Jb1_Y3lK3LNcv6KFWE",
  authDomain: "tickgetr.firebaseapp.com",
  projectId: "tickgetr",
  storageBucket: "tickgetr.appspot.com",
  messagingSenderId: "711312158616",
  appId: "1:711312158616:web:52f81ecd9712cfb58a85ed",
  measurementId: "G-DXL9CZ7V52",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const auth = getAuth(app);
const db = getFirestore(app);

// Export all
export { app, auth, db };  
   