import { useState } from 'react';
import './Home.css'
import CardPaziente from '../../sub_components/card_utente/CardPaziente';
import CardFarmaco from '../../sub_components/card_farmaco/CardFarmaco';
import CardAggiungi from '../../sub_components/card_aggiungi/CardAggiungi';

function Home(){

    const isAdmin = true; // variabile se sono admin
    
    const [selectedButton, setSelectedButton] = useState((isAdmin?1:2));

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
        },
        {
            id: 6,
            nome: "Aspirina",
            descrizione: "Farmaco antinfiammatorio, analgesico e antipiretico, usato per alleviare il dolore e ridurre la febbre."
        }
    ];

    const pazienti = [
        {id:1,nome:'edoardo',cognome:'poltronieri',sesso:'M'},
        {id:2,nome:'gaia',cognome:'poltronieri',sesso:'F'}
    ];

    function selectButton(bottone: number) {
            setSelectedButton(bottone);
    }

    return (
        <>
            <div className='container' style={{paddingTop:'4vh'}}>
                <div className='pulsanti'>
                    {isAdmin && (<button onClick={() => selectButton(1)} className={selectedButton==1?'selezionato':'non-selezionato'}><p className='testo'>Pazienti</p></button>)}
                    <button onClick={() => selectButton(2)} className={selectedButton==2?'selezionato':'non-selezionato'}><p className='testo'>Farmaci</p></button>
                    <button onClick={() => selectButton(3)} className={selectedButton==3?'selezionato':'non-selezionato'}><p className='testo'>Appuntamenti</p></button>
                </div>
                
                {(selectedButton == 1) &&(
                    <div className='griglia'>
                    <CardAggiungi/>
                    {pazienti.map((paziente)=>(
                        <div className='centro' key={paziente.id}>
                            <CardPaziente paziente={paziente}/>
                        </div>
                    ))}
                    </div>
                )}

                {selectedButton == 2 &&(
                    <div className='griglia'>
                    <CardAggiungi/>
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