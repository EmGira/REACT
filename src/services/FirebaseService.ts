
import { Farmaco } from "@/models/farmaco.model.ts";
import { auth, db } from "../configurations/FirebaseConfig.ts";



import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User
} from "firebase/auth";
import { collection, getDocs, doc, setDoc, getDoc, query, where, addDoc, deleteDoc, updateDoc } from "firebase/firestore";
import { Piano } from "@/models/piano.model.ts";
import { Utente } from "@/models/Utente.model.ts";
import { Assunzione } from "@/models/assunzione.model.ts";

interface userData{
  email: string,
  password: string,
  nome: string,
  cognome: string,
  sesso: string,
  birthDate: string,
  comune: string,
  codiceFiscale: string,
  paziente: boolean,
  telefono: number | undefined,
  nazione: string,
  provincia: string,
  indirizzo: string
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
  signUp: async (userData: Omit<Utente, "id" | "createdAt"> & { password: string }) => {
    const { email, password, ...otherData } = userData;
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;


    // Salviamo i dati dell'utente in Firestore
    await setDoc(doc(db, "users", user.uid), {
      nome: otherData.nome,
      cognome: otherData.cognome,
      birthDate: otherData.birthDate,
      sesso: otherData.sesso,
      codiceFiscale: otherData.codiceFiscale,
      telefono: otherData.telefono, // assicurati che sia numero
      email: user.email,
      indirizzo: otherData.indirizzo,
      comune: otherData.comune,
      provincia: otherData.provincia,
      nazione: otherData.nazione,
      paziente: otherData.paziente,
      createdAt: new Date(),
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

  // 🔹 Aggiorna i dati di un utente in Firestore
  updateUserData: async (userId: string, updatedData: Record<string, any>) => {
    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, updatedData);
      console.log("Dati utente aggiornati con successo.");
    } catch (error) {
      console.error("Errore durante l'aggiornamento dati utente:", error);
      throw error;
    }
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
  
  addFarmaco: async (farmaco: Farmaco) => {
    try {
      // Aggiungi il documento nella collezione "farmaci"
      const docRef = await addDoc(collection(db, "farmaci"), {
        nome: farmaco.nome,
        descrizione: farmaco.descrizione,
        avvertenze: farmaco.avvertenze,
        barcode: farmaco.barcode
      });

      console.log("Documento scritto con ID: ", docRef.id);
    } catch (e) {
      console.error("Errore nell'aggiungere il documento: ", e);
    }
  },

  addPiano: async (piano: Piano) => {
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

      // Crea l'utente su Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, paziente.email, paziente.password);
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

      console.log("Utente creato con ID:", user.uid, "e password:", paziente.password);
      return user;

    } catch (e) {
      console.error("Errore nell'aggiungere l'utente:", e);
      throw e;
    }
  },

  getAllUsers: async (): Promise<(userData & { id: string })[]> => {
    const querySnapshot = await getDocs(collection(db, "users"));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as userData) }));
  },

  getFarmaci: async () => {
    const querySnapshot = await getDocs(collection(db, 'farmaci'));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  },

  getPiani: async () => {
    const querySnapshot = await getDocs(collection(db, 'piani'));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  },

  getPianiByIdPaziente: async (idPaziente: string) => {
    const q = query(
      collection(db, 'piani'),
      where('id_paziente', '==', idPaziente)
    );
  
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  getNotifications: async (userId: string) => {
    const querySnapshot = await getDocs(collection(db, 'users', userId, 'notifiche'))
    return querySnapshot.docs.map(doc => ({id: doc.id, ...doc.data()}))
  },

  getUserById: async (id: string) => {
    try {
      const userRef = doc(db, 'users', id);  
      const userSnapshot = await getDoc(userRef);
      if (userSnapshot.exists()) {
        return userSnapshot.data();  
      } else {
        throw new Error("Utente non trovato");
      }
    } catch (error) {
      throw error;
    }
  },

  deletePiano: async (id: string) => {
    try {
        // Ottieni il riferimento al documento che vuoi eliminare
        const pianoRef = doc(db, "piani", id);
        
        // Elimina il documento da Firestore
        await deleteDoc(pianoRef);
        console.log("Piano eliminato con successo");
    } catch (error) {
        console.error("Errore nell'eliminare il piano: ", error);
    }
  },

  updatePiano: async (piano: Piano) => {
    try {

        const pianoRef = doc(db, "piani", piano.id);
        
        await updateDoc(pianoRef, {
          farmaci: piano.farmaci,
          data_inizio: piano.data_inizio,
          data_fine: piano.data_fine
        });

        console.log("Piano aggiornato con successo");
    } catch (error) {
        console.error("Errore nell'aggiornare il piano: ", error);
    }
  },

  updateAssunzione: async (a: Assunzione) => {
    try {
      const pianoRef = doc(db, "piani", a.id_piano);
      const pianoDoc = await getDoc(pianoRef);
      const piano = pianoDoc.data() as Piano;
  
      if (!piano) {
        console.error("Piano non trovato");
        return;
      }
  
      const currentDate = new Date(a.data).toISOString().split('T')[0];
      if (currentDate < piano.data_inizio || currentDate > piano.data_fine) {
        console.log("La data corrente non è nell'intervallo del piano");
        return;
      }
  
      const updatedFarmaci = piano.farmaci.map(farmaco => {
        if (farmaco.id_farmaco === a.id_farmaco && farmaco.periodo === a.periodo) {
          const updatedAssunzioni = farmaco.assunzioni.map(assunzione => {
            if (assunzione.data === a.data) {
              return { ...assunzione, stato: a.stato };
            }
            return assunzione;
          });
  
          return { ...farmaco, assunzioni: updatedAssunzioni };
        }
        return farmaco;
      });
  
      await updateDoc(pianoRef, {
        farmaci: updatedFarmaci,
        data_inizio: piano.data_inizio,
        data_fine: piano.data_fine
      });
  
      console.log("Assunzione aggiornata con successo");
    } catch (error) {
      console.error("Errore nell'aggiornare l'assunzione: ", error);
    }
  }
  

};


export default FirebaseService;
