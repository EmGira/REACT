import { useEffect, useState } from 'react';
import './Home.css'
import CardPaziente from '../../sub_components/card_utente/CardPaziente';
import CardFarmaco from '../../sub_components/card_farmaco/CardFarmaco';
import CardAggiungi from '../../sub_components/card_aggiungi/CardAggiungi';
import { FirebaseService } from '../../services/FirebaseService';
import { useNavigate } from 'react-router-dom';

function Home(){

    const navigate = useNavigate();

    // array
    const [farmaci, setFarmaci] = useState<any[]>([]);
    const [pazienti, setUsers] = useState<any[]>([]);

    // flags
    const isAdmin = true;
    const [selectedButton, setSelectedButton] = useState((isAdmin?1:2));
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchFarmaci = async () => {
        try {
          const result = await FirebaseService.getFarmaci();
          setFarmaci(result); // Assegna direttamente i valori agli array
        } catch (err) {
          setError("Errore nel recupero dei farmaci");
        }
    };
    
      const fetchUsers = async () => {
        try {
          const result = await FirebaseService.getAllUsers();
          setUsers(result); // Assegna direttamente i valori agli array
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

    if (loading) return <p>Caricamento...</p>;
    if (error) return <p>{error}</p>;

    console.log(farmaci)

    function selectButton(bottone: number) {
            setSelectedButton(bottone);
    }

    return (
        <>
            <div className='container' style={{paddingTop:'4vh'}}>
                <div className='pulsanti'>
                    {isAdmin && (<button onClick={() => selectButton(1)} className={selectedButton==1?'selezionato':'non-selezionato'}><p className='testo-button'>Pazienti</p></button>)}
                    <button onClick={() => selectButton(2)} className={selectedButton==2?'selezionato':'non-selezionato'}><p className='testo-button'>Farmaci</p></button>
                    <button onClick={() => selectButton(3)} className={selectedButton==3?'selezionato':'non-selezionato'}><p className='testo-button'>Appuntamenti</p></button>
                </div>
                
                {(selectedButton == 1) &&(
                    <div className='griglia'>
                    <div onClick={() => { navigate('/crea-paziente'); }}><CardAggiungi/></div>
                    {pazienti.map((paziente)=>(
                        <div className='centro' key={paziente.id}>
                            <CardPaziente paziente={paziente}/>
                        </div>
                    ))}
                    </div>
                )}

                {selectedButton == 2 &&(
                    <div className='griglia'>
                    <div onClick={() => { navigate('/crea-farmaco'); }}><CardAggiungi/></div>
                    {farmaci.map((farmaco)=>(
                        <div className='centro' key={farmaco.id}>
                            <CardFarmaco farmaco={farmaco}/>
                        </div>
                    ))}
                    </div>
                )}
                
            </div>
        </>
    )
}

export default Home;