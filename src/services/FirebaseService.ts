import { auth, db } from "../configurations/FirebaseConfig.ts";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  User 
} from "firebase/auth";
import { collection, getDocs, doc, setDoc, getDoc, query, where, addDoc } from "firebase/firestore";

interface userData {
  email: string;
  password: string;
  nome: string;
  cognome: string;
  sesso: string;
  birthDate: string;
  comune: string;
  codiceFiscale: string;
  paziente: boolean;
}
// 🔥 Oggetto per gestire Firebase in modo centralizzato
export const FirebaseService = {
  
  // 🔹 Recupera l'utente attuale
  getCurrentUser: (): Promise<User | null> => {
    return new Promise((resolve) => {
      onAuthStateChanged(auth, (user) => {
        resolve(user);
      });
    });
  },

  // 🔹 Registra un nuovo utente e salva nel database
  signUp: async (userData: userData) => {
    const {email, password, ...otherData} = userData;
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Salviamo i dati dell'utente in Firestore
    await setDoc(doc(db, "users", user.uid), {

      nome: otherData.nome,
      cognome: otherData.cognome,
      sesso: otherData.sesso,
      birthDate: otherData.birthDate,
      comune: otherData.comune,
      codiceFiscale: otherData.codiceFiscale,
      paziente: otherData.paziente,
      email: user.email,
    
      createdAt: new Date()
    });

    return user;
  },

  // 🔹 Login utente
  signIn: async (email: string, password: string) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  },

  // 🔹 Logout utente
  logout: async () => {
    await signOut(auth);
  },

  // 🔹 Recupera i dati di un utente da Firestore
  getUserData: async (userId: string) => {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
  },

  // 🔹 Recupera tutti gli utenti
  getAllUsers: async () => {
    const querySnapshot = await getDocs(collection(db, "users"));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },

  // 🔹 Aggiunge dati a una collezione specificata
  addData: async (collectionName: string, docData: Record<string, any>) => {
    const newDocRef = doc(collection(db, collectionName));
    await setDoc(newDocRef, docData);
    return { id: newDocRef.id, ...docData };
  },

  getFarmaci: async () => {
    const querySnapshot = await getDocs(collection(db, 'farmaci'));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  },

  findMedicByEmail: async (email: string) => {

    try {
      const usersRef = collection(db, "users");
      const q = query(
        usersRef,
        where("email", "==", email),
        where("paziente", "==", false)  // cerchiamo solo i medici
      );

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        console.log("No medic found with the given email.");
        return null;
      }

      const medicDoc = querySnapshot.docs[0];
      return { id: medicDoc.id, ...medicDoc.data() };
    } catch (error) {
      console.error("Error fetching medic by email:", error);
      throw error;
    }
  },

  addFarmaco: async (farmaco: any) => {
    try {
      // Aggiungi il documento nella collezione "farmaci"
      const docRef = await addDoc(collection(db, "farmaci"), {
        descrizione: farmaco.descrizione,
        nome: farmaco.nome,
        quantità: farmaco.quantità,
        scadenza: farmaco.scadenza,
        srcImg: farmaco.srcImg
      });
  
      console.log("Documento scritto con ID: ", docRef.id);
    } catch (e) {
      console.error("Errore nell'aggiungere il documento: ", e);
    }
  }
  


//ckjaifjawe
  



};


export default FirebaseService;
