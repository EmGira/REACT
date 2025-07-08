import { useEffect, useState } from 'react';
import './Home.css';
import CardFarmaco from '../../sub_components/card_farmaco/CardFarmaco';
import CardAggiungi from '../../sub_components/card_aggiungi/CardAggiungi';
import { FirebaseService } from '../../services/FirebaseService';
import { useNavigate } from 'react-router-dom';

import Calendario from '../calendario/Calendario';
import { useAuth } from '../contexts/AuthContext';
import { Farmaco } from '@/models/farmaco.model'; // Importa l'interfaccia Farmaco
import CardPaziente from '@/sub_components/card_paziente/CardPaziente';

function Home() {
    const navigate = useNavigate();
    
 
    // array
    const [farmaci, setFarmaci] = useState<Farmaco[]>([]); // Modificato il tipo a Farmaco[]
    const [pazienti, setUsers] = useState<any[]>([]);  // Tipizza correttamente anche pazienti, se possibile

    // flags
    const isAdmin = true;
    const [selectedButton, setSelectedButton] = useState((isAdmin ? 1 : 2));
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch dei farmaci
    const fetchFarmaci = async () => {
        try {
            const result: any[] = await FirebaseService.getFarmaci(); // Ottieni i farmaci da Firebase
            setFarmaci(result); // Imposta i farmaci nello stato
        } catch (err) {
            setError("Errore nel recupero dei farmaci");
        }
    };

    // Fetch degli utenti (pazienti)
    const fetchUsers = async () => {
        try {
            const result = (await FirebaseService.getAllUsers()).filter((utente: any) => utente.paziente == true);
            setUsers(result); // Imposta gli utenti nello stato
        } catch (err) {
            setError("Errore nel recupero degli utenti");
        }
    };
    
    useEffect(() => {
        // Esegui entrambe le chiamate di fetch
        fetchUsers();
        fetchFarmaci();
        
       
    }, []);

    useEffect(() => {
        if (farmaci.length > 0 && pazienti.length > 0) {
            setLoading(false);
        }
    }, [farmaci, pazienti]);

    if (loading) return <p><div className="container"></div></p>;
    if (error) return <p>{error}</p>;

    // Funzione per selezionare il bottone
    function selectButton(bottone: number) {
        setSelectedButton(bottone);
    }

    return (
        <div className='body'>
            <div className='container' style={{ paddingTop: '4vh' }}>
                <div className='pulsanti'>
                    {isAdmin && (
                        <button onClick={() => selectButton(1)} className={selectedButton == 1 ? 'selezionato' : 'non-selezionato'}>
                            <p className='testo-button'>Pazienti</p>
                        </button>
                    )}
                    <button onClick={() => selectButton(2)} className={selectedButton == 2 ? 'selezionato' : 'non-selezionato'}>
                        <p className='testo-button'>Farmaci</p>
                    </button>
                    <button onClick={() => selectButton(3)} className={selectedButton == 3 ? 'selezionato' : 'non-selezionato'}>
                        <p className='testo-button'>Appuntamenti</p>
                    </button>
                </div>

                {(selectedButton == 1) && (
                    <div className='griglia'>
                        <div className='add_box' onClick={() => { navigate('/crea-paziente'); }}><CardAggiungi /></div>
                        {pazienti.map((paziente) => (
                            <div className='centro' key={paziente.id}>
                                <CardPaziente paziente={paziente} />
                            </div>
                        ))}
                    </div>
                )}

                {selectedButton == 2 && (
                    <div className='griglia'>
                        <div className='add_box' onClick={() => { navigate('/crea-farmaco'); }}><CardAggiungi /></div>
                        {farmaci.map((farmaco) => (
                            <div className='centro' key={farmaco.id}>
                                <CardFarmaco farmaco={farmaco} />
                            </div>
                        ))}
                    </div>
                )}

                {selectedButton == 3 &&(
                           <div>
                                <Calendario></Calendario>
                           </div>         
                )}

            </div>
        </div>
    );
}

export default Home;
