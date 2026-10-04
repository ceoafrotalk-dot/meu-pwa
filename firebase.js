import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCNe7Om0H6bHFY5KijTGi1K8T52ih1KyMw",
  authDomain: "afrotalk-6ceb2.firebaseapp.com",
  projectId: "afrotalk-6ceb2",
  storageBucket: "afrotalk-6ceb2.firebasestorage.app",
  messagingSenderId: "1042550225272",
  appId: "1:1042550225272:web:7bee6ab375b0c34f91f08d"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);