// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


// import 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD90O3VQrUd4pq5gJskQVg-pneJBFmORLE",
  authDomain: "bucksbunny-b6f88.firebaseapp.com",
  projectId: "bucksbunny-b6f88",
  storageBucket: "bucksbunny-b6f88.appspot.com",
  messagingSenderId: "313320847131",
  appId: "1:313320847131:web:8bd1b455d06f962cfd45be",
  measurementId: "G-T5B3MVY9L2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export const auth = getAuth(app);
// export default firebase;

export const db = getFirestore(app);

export default app;