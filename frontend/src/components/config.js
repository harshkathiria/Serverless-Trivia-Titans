// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "",
  authDomain: "csci-5410-s23-391205.firebaseapp.com",
  projectId: "csci-5410-s23-391205",
  storageBucket: "csci-5410-s23-391205.appspot.com",
  messagingSenderId: "436736191101",
  appId: "1:436736191101:web:bee9def20be4fd812d1f14",
  measurementId: "G-4Q0DWFXB2H"
};

// Initialize Firebase
const kathiriaApp = initializeApp(firebaseConfig,"kathiriaApp");
const analytics = getAnalytics(kathiriaApp);
const auth = getAuth(kathiriaApp)
const provider = new GoogleAuthProvider();
export { auth, provider };
export const database = getAuth(kathiriaApp);