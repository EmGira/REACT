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
import CalendarioPazienti from '../calendario/CalendarioPazienti';
import { Utente } from '@/models/Utente.model';



function HomePaziente() {

    const navigate = useNavigate();
    
    const {
        authUser,
        loading
    } = useAuth();

  

    // flags
    const isAdmin = true;
    const [selectedButton, setSelectedButton] = useState((isAdmin ? 3 : 2));

    const [error, setError] = useState<string | null>(null);

    const [currentUserData, setCurrentUserData] = useState<Utente | null>(null);
    const [userId, setUserId] = useState<string | null>(null);




    
  useEffect(() => {
      if (!authUser?.email) return;

      const fetchUserDocId = async () => {
        
        const userData = await FirebaseService.findPatientByEmail(authUser.email)
        if(userData){
         setUserId(userData.id);
        }
      }
      fetchUserDocId();

    }, [authUser])


    useEffect(() => {
        if (!userId) return;

        const fetchUserData = async () => {
            try {
                console.log("DIOCANEEE", userId);
                const userData = await FirebaseService.getUserDataDC(userId);
                setCurrentUserData(userData);
            } catch (err) {
                setError('Errore nel recupero dei dati utente');
            }
        };
        fetchUserData();
    }, [userId]);
  

    // Funzione per selezionare il bottone
    function selectButton(bottone: number) {
        setSelectedButton(bottone);
    }

    return (
        <div className='body'>
            <div className='container' style={{ paddingTop: '4vh' }}>
                <div className='pulsanti'>
                    {isAdmin && (
                        <button onClick={() => selectButton(3)} className={selectedButton == 3 ? 'selezionato' : 'non-selezionato'}>
                            <p className='testo-button'>Appuntamenti</p>
                        </button>
                    )}

                          {/* <button onClick={() => selectButton(2)} className={selectedButton == 2 ? 'selezionato' : 'non-selezionato'}>
                            <p className='testo-button'>Profilo</p>
                        </button> */}
                </div>

             

                {selectedButton == 3 &&(
                           <div>
                                
                                <CalendarioPazienti></CalendarioPazienti>
                           </div>         
                )}

                {selectedButton == 2 && (
                    <div>
                        <CardPaziente paziente={currentUserData} />
                    </div>
                )}

            </div>
        </div>
    );
}

export default HomePaziente;
