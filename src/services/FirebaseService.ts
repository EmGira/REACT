
import { auth, db } from "../configurations/FirebaseConfig.ts";
import {Utente} from "../models/utente.model.ts"


import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  User 
} from "firebase/auth";
import { collection, getDocs, doc, setDoc, getDoc, query, where, addDoc } from "firebase/firestore";


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
  signUp: async (userData: Omit<Utente, "id" | "createdAt"> & { password: string }) => {
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

  // 🔹 Aggiunge dati a una collezione specificata
  addData: async (collectionName: string, docData: Record<string, any>) => {
    const newDocRef = doc(collection(db, collectionName));
    await setDoc(newDocRef, docData);
    return { id: newDocRef.id, ...docData };
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
        avvertenze: farmaco.avvertenze,
        srcImg: farmaco.srcImg
      });
  
      console.log("Documento scritto con ID: ", docRef.id);
    } catch (e) {
      console.error("Errore nell'aggiungere il documento: ", e);
    }
  },

  addPiano: async (piano: any) => {
    try {
      // Aggiungi il documento nella collezione "farmaci"
      const docRef = await addDoc(collection(db, "piani"), {
        farmaci: piano.farmaci,
        id_paziente: piano.id_paziente,
        data_inizio: piano.data_inizio,
        data_fine: piano.data_fine
      });
  
      console.log("Documento scritto con ID: ", docRef.id);
    } catch (e) {
      console.error("Errore nell'aggiungere il documento: ", e);
    }
  },

  addPaziente: async (paziente: any) => {
    try {
      // Estrai l'anno da birthDate
      const birthYear = new Date(paziente.birthDate).getFullYear();
      
      // Crea la password: nome + cognome + anno
      const password = `${paziente.nome}${paziente.cognome}${birthYear}`;
  
      // Crea l'utente su Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, paziente.email, password);
      const user = userCredential.user;
  
      // Salva i dati utente su Firestore con UID
      await setDoc(doc(db, "users", user.uid), {
        nome: paziente.nome,
        cognome: paziente.cognome,
        birthDate: paziente.birthDate,
        sesso: paziente.sesso,
        codiceFiscale: paziente.codiceFiscale,
        telefono: paziente.telefono,
        email: user.email,
        indirizzo: paziente.indirizzo,
        comune: paziente.comune,
        provincia: paziente.provincia,
        nazione: paziente.nazione,
        paziente: true,
        createdAt: new Date(),
      });
  
      console.log("Utente creato con ID:", user.uid, "e password:", password);
      return user;
  
    } catch (e) {
      console.error("Errore nell'aggiungere l'utente:", e);
      throw e;
    }
  },

  getAllUsers: async () => {
    const querySnapshot = await getDocs(collection(db, "users"));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  getFarmaci: async () => {
    const querySnapshot = await getDocs(collection(db, 'farmaci'));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  },

  getPiani: async () => {
    const querySnapshot = await getDocs(collection(db, 'piani'));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  }

};


export default FirebaseService;
