
import CalendarEx from 'react-calendar'
import 'react-calendar/dist/Calendar.css';
import { useState } from 'react';

import './Calendario.css'



function CalendarComponent(){

    const [selectedDates, setSelectedDates] = useState<Date[]>([]);
    const [activeDate, setActiveDate] = useState<Date | null>(null)

    const handleClick = (date: Date) => {   //salva la data selezionata
        setActiveDate(date);

 

        return null;
    }
    
    const handleSubmit = () => {
        if (
          activeDate &&
          !selectedDates.some((d) => d.toDateString() === activeDate.toDateString())        //una voltafatto il submit se ho selezionato una data non nulla, enon e presente nella lista di date selezioate, la agigungo
        ) {
          setSelectedDates([...selectedDates, activeDate]);
        }

        setActiveDate(null);
      };


    const tileContent = ({date, view}: { date: Date; view: string }) => {     //modifica contenuto della tile
        // Mostra il punto rosso solo se la data combacia con quella selezionata
   
    if (
        view === 'month' && selectedDates && 
        selectedDates.some((d) => d.toDateString() === date.toDateString())         //some: controlla se almeno un elemento soddisfa la condizione, se Si termina
      ) 
        {
            return (
            <div>
                <span style={{ color: 'red' }}>•</span>
            </div>
            );
        }
  
    }


  

    return(
        <>

        <div className = "all">
            <CalendarEx onClickDay={handleClick} tileContent={tileContent} className = "calendar"/>
              
                {selectedDates.length > 0 && (         //se selectedDate e' truthy (non null o undefined) allora renderizza
                    <div>
                      <p> hai selezioneto le seguenti date: </p>
                        <ul>
                            {selectedDates.map((d, i) => 
                            
                             (<li key = {i}>{d.toDateString()}</li>)
                        
                            )}
                        </ul>
                    </div>
                )}

                {activeDate && (
                 <div className="modal-overlay">
                 <div className="modal-content">
                   <h1 className="Login">Crea Appuntamento</h1>
                   <div className="inputs">
                     <input type="email" placeholder="Email" />
                     <input type="password" placeholder="Password" />
                   </div>
                   <div className="buttons">
                     <button onClick={handleSubmit}>Submit</button>
                     <button onClick={() => {setActiveDate(null)}}>Annulla</button>
                   
                   </div>
                 </div>
               </div>
                )}




        </div>
        </>
    )
}


export default CalendarComponent

//https://www.npmjs.com/package/react-calendar


//appare form quado selezioni data
//on Submit, data viene segnata in rosso
//se premo data salvata, vedo i form e posso aggiungerne un altro