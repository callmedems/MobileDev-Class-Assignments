import { FirebaseApp, initializeApp } from 'firebase/app';
import { Database, getDatabase } from 'firebase/database';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDdaVZ80sVpbsgE4MDyx7u5t2Gi2FrnCAE",
  authDomain: "actividad-firebase-d45c7.firebaseapp.com",
  databaseURL: "https://actividad-firebase-d45c7-default-rtdb.firebaseio.com",
  projectId: "actividad-firebase-d45c7",
  storageBucket: "actividad-firebase-d45c7.firebasestorage.app",
  messagingSenderId: "827039559612",
  appId: "1:827039559612:web:57575f2d0d33e7811e05b9",
  measurementId: "G-V0NENCBPLF"
};

// Initialize Firebase
const app: FirebaseApp = initializeApp(firebaseConfig);
const database: Database = getDatabase(app);

console.log('Firebase initialized successfully');

export { app, database };

