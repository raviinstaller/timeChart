import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAAz_ec8UPc9nCr3pPOZxITziv7dTWpInY",
  authDomain: "task-new-aa5a9.firebaseapp.com",
  projectId: "task-new-aa5a9",
  storageBucket: "task-new-aa5a9.appspot.com",
  messagingSenderId: "248731098158",
  appId: "1:248731098158:web:5d20d9640ca72d3d1413bf",
};

const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export default getFirestore();
