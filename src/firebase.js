import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBwne0roB-QztkKpjdmLfQk4DhCNB3Wljw",
    authDomain: "netflix-clone-neeraj.firebaseapp.com",
    projectId: "netflix-clone-neeraj",
    storageBucket: "netflix-clone-neeraj.appspot.com",
    messagingSenderId: "492403381954",
    appId: "1:492403381954:web:351a730f66ca56f0ba0d5b"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore();
const auth = getAuth(firebaseApp);

export { auth };
export default db;