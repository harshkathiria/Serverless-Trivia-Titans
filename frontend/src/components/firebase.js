import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
const firebaseConfig = {
  apiKey: "",
  authDomain: "csci5410-serverless-lab.firebaseapp.com",
  projectId: "csci5410-serverless-lab",
  storageBucket: "csci5410-serverless-lab.appspot.com",
  messagingSenderId: "747043115864",
  appId: "1:747043115864:web:91e72cd8be91a55e198b2d"
};

const harshApp = initializeApp(firebaseConfig, "harshApp");
const db = getFirestore(harshApp);

export default db;
