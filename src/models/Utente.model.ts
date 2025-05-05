
export interface Utente {
    id?: string; // ← opzionale, assegnato da Firestore automaticamente
    nome: string;
    cognome: string;
    birthDate: string; // formato ISO (es. "1990-01-01")
    sesso: "m" | "f";
    codiceFiscale: string;
    telefono: number;
    email: string;
    indirizzo: string;
    comune: string;
    provincia: string;
    nazione: string;
    paziente: boolean;
    createdAt?: Date; // opzionale, gestito dal server
}