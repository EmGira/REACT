import './CreaFarmaci.css';
import { FirebaseService } from '../../services/FirebaseService';
import { useEffect, useState } from 'react';
import { Farmaco } from '@/models/farmaco.model';

function CreaFarmaci() {
    const [isFormValid, setIsFormValid] = useState(false);

    // Funzione per generare un barcode casuale di 13 cifre
    const generateBarcode = (): number => {
        return Math.floor(Math.random() * 10000000000000); // Genera un numero di 13 cifre
    };

    // Stato del farmaco, inizializzato in base all'interfaccia Farmaco
    const [farmaco, setFarmaco] = useState<Farmaco>({
        id: "",          // ID sarà probabilmente generato da Firestore
        nome: "",
        descrizione: "",
        avvertenze: "",
        barcode: generateBarcode()  // Imposta il barcode casuale all'inizio
    });

    // Effetto per la validazione del form
    useEffect(() => {
        const { nome, descrizione, avvertenze, barcode } = farmaco;
        const isValid: boolean =
            nome.trim() !== '' &&
            descrizione.trim() !== '' &&
            avvertenze.trim() !== '' &&
            barcode > 0;  // La validazione per il barcode deve essere maggiore di 0

        setIsFormValid(isValid);
    }, [farmaco]);

    // Funzione per gestire il cambiamento dei campi
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;

        // Gestiamo solo i campi che non sono il barcode
        if (id !== 'barcode') {
            setFarmaco((prev: Farmaco) => ({
                ...prev,
                [id]: value
            }));
        }
    };

    // Funzione per aggiungere un nuovo farmaco
    const addFarmaco = async (e: React.FormEvent) => {
        e.preventDefault(); // Evita il refresh della pagina
        const barcode = generateBarcode(); // Genera un barcode casuale

        const newFarmaco: Farmaco = {
            ...farmaco,
            barcode: barcode  // Aggiungi il barcode generato al farmaco
        };

        try {
            await FirebaseService.addFarmaco(newFarmaco); // Utilizza Firebase per aggiungere il farmaco
            alert("Farmaco aggiunto con successo!");
            setFarmaco({
                id: "",          // Reset dell'ID
                nome: "",
                descrizione: "",
                avvertenze: "",
                barcode: generateBarcode()  // Genera un nuovo barcode casuale per il prossimo farmaco
            });
        } catch (error) {
            console.error("Errore nell'aggiunta del farmaco:", error);
        }
    };

    return (
        <div className="c">
            <div className='form-container'>
                <div className='form-card'>
                    <h1>Aggiungi un farmaco</h1>
                    <form onSubmit={addFarmaco}>
                        <div className="form-grid">
                            <div className="form-group">
                                <label htmlFor="nome">Nome</label>
                                <input id="nome" type="text" value={farmaco.nome} onChange={handleChange} required />
                            </div>

                            {/* Il campo barcode non è visibile all'utente */}
                            <div className="form-group">
                                <label htmlFor="barcode">Barcode</label>
                                <input
                                    id="barcode"
                                    type="text"
                                    value={farmaco.barcode > 0 ? farmaco.barcode : 'Generato automaticamente'}
                                    readOnly  // Il campo è solo in lettura, non modificabile
                                />
                            </div>
                        </div>

                        <div className="form-group full-width">
                            <label htmlFor="descrizione">Descrizione</label>
                            <textarea id="descrizione" rows={4} value={farmaco.descrizione} onChange={handleChange} required></textarea>
                        </div>

                        <div className="form-group full-width">
                            <label htmlFor="avvertenze">Avvertenze</label>
                            <textarea id="avvertenze" rows={4} value={farmaco.avvertenze} onChange={handleChange} required></textarea>
                        </div>

                        <button
                            type="submit"
                            className={`submit-btn ${!isFormValid ? 'disabled' : ''}`}
                            disabled={!isFormValid}
                        >
                            Crea
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default CreaFarmaci;
