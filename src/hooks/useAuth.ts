import { useState, useEffect } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../configurations/FirebaseConfig.ts";

// il valore ritornato dalla funzione si aggiorna 
// reattivamente al seconda dello stato di login dell'utnte

// da utilizzare per i componenti che aspettano la modifica 
// dello stato dell'utnte

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  return { user };
};
