// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const API_KEYs = process.env.API_KEY;
const AUTH_DOMAINs = process.env.AUTH_DOMAIN;
// const PROJECT_IDs = process.env.PROJECT_ID;
const STORE_BUCKETs = process.env.STORE_BUCKET;
const MESSAGING_SENDERs = process.env.MESSAGING_SENDER;
const APP_IDs = process.env.APP_ID;

const firebaseConfig = {
  apiKey: API_KEYs,
  authDomain: AUTH_DOMAINs,
  projectId: "side-projects-7b226",
  storageBucket: STORE_BUCKETs,
  messagingSenderId: MESSAGING_SENDERs,
  appId: APP_IDs,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
