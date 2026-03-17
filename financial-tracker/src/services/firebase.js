import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCEn8zcWg4W5vuRPPR9WeYD1XXItucNfBI",
  authDomain: "financial-tracker-55f50.firebaseapp.com",
  projectId: "financial-tracker-55f50",
  storageBucket: "financial-tracker-55f50.firebasestorage.app",
  messagingSenderId: "483258465861",
  appId: "1:483258465861:web:38f8e41681f5a8066f2d2c",
  measurementId: "G-WY12YEGDRD",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };