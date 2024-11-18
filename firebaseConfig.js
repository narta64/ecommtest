// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
import { getAuth, getAuthStateChanged } from "firebase/auth";
import { getDatabase, ref as dbRef, push, set, onValue } from "firebase/database";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyACw5CB5K3_e9-eroseXMJJ_eZ7l5739wI",
  authDomain: "ecomm-database2.firebaseapp.com",
  projectId: "ecomm-database2",
  storageBucket: "ecomm-database2.firebasestorage.app",
  messagingSenderId: "667749276754",
  appId: "1:667749276754:web:aa7896875bade31ab5938b",
  measurementId: "G-Q0EP5VFK09"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const storage = getStorage(app);
const database = getDatabase(app);
