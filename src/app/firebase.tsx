// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAVJCziq5WQeFI1f6CCfYVwlBZdT4XLzSE",
  authDomain: "side-projects-7b226.firebaseapp.com",
  projectId: "side-projects-7b226",
  storageBucket: "side-projects-7b226.appspot.com",
  messagingSenderId: "727159662616",
  appId: "1:727159662616:web:1b372d07367ae480307b6d",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);