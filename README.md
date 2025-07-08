# 🩺 Medical Management App

Questo progetto è un'applicazione sviluppata con React che abbiamo realizzato per gestire l'interazione tra medici e pazienti, in particolare per quanto riguarda farmaci, appuntamenti, piani farmacologici e notifiche.

Ho utilizzato **Firebase** sia per l'autenticazione degli utenti sia per la gestione dei dati tramite **Firestore**. Inoltre, ho creato un servizio generale per semplificare le chiamate al database e per disporre dei dati in maniera globale nell'applicazione.

## Come funziona

L'app parte da un sistema di login e registrazione. Chi non ha ancora un account può registrarsi come **medico** o come **paziente**. Dopo l'accesso, l’utente viene reindirizzato a una home differente a seconda del suo ruolo.

### Home Medico

Se si accede come medico, è possibile:
- Visualizzare e gestire i pazienti associati.
- Aggiungere nuovi farmaci e modificarli.
- Creare appuntamenti tramite un calendario interattivo.
- Assegnare ai pazienti dei **piani farmacologici**.
- Gestire i piani attivi (modificarli, aggiornarli, ecc.).
- Cambiare i dati dei pazienti se necessario.

### Home Paziente

I pazienti invece hanno accesso a:
- Il calendario con i propri appuntamenti.
- La possibilità di segnalare se hanno assunto o dimenticato un farmaco.
- La visualizzazione dei piani farmacologici assegnati dal proprio medico.

## Sistema di Notifiche

Sia medici che pazienti vedono un’icona delle notifiche in alto a destra nell’header. Le notifiche servono a segnalare eventi importanti come nuovi appuntamenti, modifiche o aggiornamenti nei trattamenti.

## Struttura del progetto

Il progetto è organizzato in componenti React riutilizzabili e pagine principali per ogni sezione (login, home medico, home paziente, ecc.). C’è anche una cartella dedicata ai servizi, dove si trovano le funzioni che comunicano con Firebase e con il backend.

## Avvio del progetto

Per far partire il progetto in locale:

1. Clonare la repository:
   ```bash
   git clone https://github.com/EmGira/REACT.git
