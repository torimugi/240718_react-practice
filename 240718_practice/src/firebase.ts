// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDHlOpOlbufXBHiiKBLJ0g4v-YZcn8TkAY",
  authDomain: "householdtypescript-9a43b.firebaseapp.com",
  projectId: "householdtypescript-9a43b",
  storageBucket: "householdtypescript-9a43b.appspot.com",
  messagingSenderId: "631067144029",
  appId: "1:631067144029:web:503ba7b674fc27dd98c2b4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };