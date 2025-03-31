import { useState } from 'react';
import CardUtente from '../../sub_components/card_utente/CardUtente';
import './Home.css'

function Home(){

    const farmaci = [
        {
          id: 1,
          nome: "Paracetamolo",
          descrizione: "Antidolorifico e antipiretico, utilizzato per alleviare il dolore e ridurre la febbre."
        },
        {
          id: 2,
          nome: "Ibuprofene",
          descrizione: "Antinfiammatorio non steroideo (FANS), usato per ridurre l'infiammazione, il dolore e la febbre."
        },
        {
          id: 3,
          nome: "Amoxicillina",
          descrizione: "Antibiotico appartenente alla classe delle penicilline, usato per trattare le infezioni batteriche."
        },
        {
          id: 4,
          nome: "Loratadina",
          descrizione: "Antistaminico utilizzato per trattare i sintomi di allergie come naso che cola e occhi che lacrimano."
        },
        {
          id: 5,
          nome: "Aspirina",
          descrizione: "Farmaco antinfiammatorio, analgesico e antipiretico, usato per alleviare il dolore e ridurre la febbre."
        }
    ];
      
    const [selectedButton, setSelectedButton] = useState(1);

    const pazienti = [{nome:'prova'}];

    function selectButton(bottone: number) {
            setSelectedButton(bottone);
    }

    return (
        <>
            <div className='container' style={{paddingTop:'4vh'}}>
                <div className='pulsanti'>
                    <button onClick={() => selectButton(1)} className={selectedButton==1?'selezionato':'non-selezionato'}>Pazienti</button>
                    <button onClick={() => selectButton(2)} className={selectedButton==2?'selezionato':'non-selezionato'}>Farmaci</button>
                    <button onClick={() => selectButton(3)} className={selectedButton==3?'selezionato':'non-selezionato'}>Appuntamenti</button>
                </div>
                
                {selectedButton == 1 &&(
                    <div className='griglia'>
                    {pazienti.map((paziente)=>(
                        <div className='centro'>
                            <CardUtente></CardUtente>
                        </div>
                    ))}
                    </div>
                )}

                {selectedButton == 2 &&(
                    <div className='griglia'>
                    {farmaci.map((farmaco)=>(
                        <div className='centro'>
                            <CardUtente></CardUtente>
                        </div>
                    ))}
                    </div>
                )}

                
            </div>
        </>
    )
}

export default Home;