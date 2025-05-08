import { getToken, onMessage } from "firebase/messaging";
import { messaging } from "../configurations/FirebaseConfig.ts";  // Importa il tuo file di configurazione di Firebase
import { request } from "http";
import { useAuth } from "@/hooks/useAuth.ts";
import FirebaseService from "./FirebaseService.ts";
// Funzione per richiedere il permesso e ottenere il token


export const requestPermissionAndGetToken = async (userId: string) => {

    try{
     const permission = await Notification.requestPermission()

        if(permission == "granted"){
                getToken(messaging, {vapidKey: "BGia3NPP8kjEZvMOsVX4ioT6CJynyEfmy2A4kLBIs_E2nCwfMwwJ8zefg0ZJbmPBxEkOaSdnjcObHGwFfTuteOw"})
                .then(currentToken => {
                        console.log("Token:", currentToken)
                        saveTokenToBackend(currentToken, userId)
                })
                .catch(err => console.error("Errore nel getToken", err));
        }else{
            console.log("permission wasnt granted")
        }
    
    } catch (error) {
        console.error("errore nel richiede il permesso o ottenere il token", error)
    }
}


//gestisce ricezione messaggi (in foreground)
onMessage(messaging, (payload: any) => {
    console.log('Messaggio ricevuto in foreground:', payload);
    // Puoi fare qualcosa con il payload, per esempio mostrare una notifica all'interno dell'app
    // Qui puoi gestire la notifica come vuoi, per esempio mostrando un alert:
    alert(`${payload.notification.title}: ${payload.notification.body}`);
  });

// Funzione per salvare il token in Firestore
export const saveTokenToBackend = (token: any, userId: string) => {

  FirebaseService.addData( `/users/${userId}/notifiche`, token)


};

