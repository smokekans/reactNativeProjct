import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA10r1wiMvi4AqtanbZe6hkK0qMIctK444",
  authDomain: "reactnative-89.firebaseapp.com",
  databaseURL:
    "https://reactnative-89-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "reactnative-89",
  storageBucket: "reactnative-89.appspot.com",
  messagingSenderId: "502531350318",
  appId: "1:502531350318:web:ef9bd91a39f9f1f13ae4bf",
  measurementId: "G-CSTJE88G68",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
