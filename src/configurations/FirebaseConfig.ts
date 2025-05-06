import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore} from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getMessaging} from "firebase/messaging"


const firebaseConfig = {
  apiKey: "AIzaSyDRCGQUvk9LpULOhJd3PHhO9VnIK0dVVAM",
  authDomain: "react-farmaci-f85c3.firebaseapp.com",
  databaseURL: "https://react-farmaci-f85c3-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "react-farmaci-f85c3",
  storageBucket: "react-farmaci-f85c3.firebasestorage.app",
  messagingSenderId: "672408559692",
  appId: "1:672408559692:web:d899861b5eb7c0487314e9",
  measurementId: "G-HT894BD3R1"
};

// Inizializza Firebase
const app = initializeApp(firebaseConfig);



// Esporta i servizi Firebase
export const auth = getAuth(app);
export const db = getFirestore(app)
export const storage = getStorage(app);
export const messaging = getMessaging(app);

export default app;