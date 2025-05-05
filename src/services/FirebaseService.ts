
import { auth, db } from "../configurations/FirebaseConfig.ts";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  User 
} from "firebase/auth";
import { collection, getDocs, doc, setDoc, getDoc, query, where, addDoc, deleteDoc, updateDoc } from "firebase/firestore";

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

  getMedicAppointments: async (MedicDocumentId: string) => {
    const medicAppRef = collection(db, "users", MedicDocumentId, "appuntamenti");
    const q = query(medicAppRef);

    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      console.log("No appointments found, for this Id: ", MedicDocumentId);
      return null;
    }

    const appointments = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    return appointments
  },

  deleteData: async (collectionName: string, docId: string): Promise<void> => {
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
  },


  DeleteApptByFieldId: async (MedicDocumentId: string, wantedId: number) => {

    const q = query(collection(db, "users", MedicDocumentId, "appuntamenti"), where("id", "==", wantedId))
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      console.log("Nessun documento trovato con id:", wantedId);
      return;
    }

    for (const docSnap of snapshot.docs) {
      await deleteDoc(docSnap.ref);
    }
  },

  updateApptByFieldId: async (
    medicDocumentId: string,
    wantedId: number,
    updatedApp: Record<string, any>
  ): Promise<void> => {
    // Riferimento alla sottocollezione "appuntamenti"
    const appointmentsRef = collection(db, "users", medicDocumentId, "appuntamenti");
  
    // Query per trovare il documento con campo `id` uguale a `wantedId`
    const q = query(appointmentsRef, where("id", "==", wantedId));
    const querySnapshot = await getDocs(q);
  
    if (querySnapshot.empty) {
      console.warn(`Nessun documento trovato con id = ${wantedId}`);
      return;
    }
  
    // Prendiamo il primo documento corrispondente
    const docSnapshot = querySnapshot.docs[0];
    const docRef = doc(db, "users", medicDocumentId, "appuntamenti", docSnapshot.id);
  
    // Aggiorna solo i campi passati in `updatedApp` (non sostituisce il documento intero)
    await updateDoc(docRef, updatedApp);
  },

  findPatientByEmail: async (email: string) => {

    try {
      const usersRef = collection(db, "users");
      const q = query(
        usersRef,
        where("email", "==", email),
        where("paziente", "==", true)  // cerchiamo solo i medici
      );

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        console.log("No Patient found with the given email.");
        return null;
      }

      const medicDoc = querySnapshot.docs[0];
      return { id: medicDoc.id, ...medicDoc.data() };
    } catch (error) {
      console.error("Error fetching patient by email:", error);
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
        email: user.email,
        sesso: paziente.sesso,
        comune: paziente.comune,
        codiceFiscale: paziente.codiceFiscale,
        birthDate: paziente.birthDate,
        paziente: true,
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
