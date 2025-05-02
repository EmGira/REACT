
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css';
import { useState, useEffect } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import './Calendario.css'
import FirebaseService from '@/services/FirebaseService';
import {useAuth} from '../contexts/AuthContext'

interface Appointments{
  id: string,
  data: string,
  orario: string,
  paziente: string,
  descrizione: string
}

function CalendarComponent(){

    const {
      authUser
      } = useAuth();

    const [selectedDates, setSelectedDates] = useState<Date[]>([]);
    const [activeDate, setActiveDate] = useState<Date | null>(null)
    const [showForm, setShowForm] = useState<boolean | null>(null)

    const [appointment, setAppointment] = useState<Appointments>({
      id: authUser?.email || "",
      data: "",
      orario: "",
      paziente: "",
      descrizione: "" 
    })

    const emptyAppointment: Appointments = {
      id: authUser?.email || "",
      data: "",
      orario: "",
      paziente: "",
      descrizione: "" 
    };

    useEffect(() => {
      setAppointment(prev => ({
        ...prev,
        data: activeDate?.toDateString() || "",
      }));
    }, [activeDate]);
    


    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {

      setAppointment({
          ...appointment,
          [e.target.name]: e.target.value
      })

  }

    const handleClick = (date: Date) => {   //salva la data selezionata
        setActiveDate(date);
        return null;
    }
    
    const handleSubmit = async () => {
        if (
          activeDate &&
          !selectedDates.some((d) => d.toDateString() === activeDate.toDateString())        //una voltafatto il submit se ho selezionato una data non nulla, enon e presente nella lista di date selezioate, la agigungo
        ) {
          setSelectedDates([...selectedDates, activeDate]);
        }

        console.log(authUser.email)

        const userData = await FirebaseService.findMedicByEmail(authUser.email)
        if(userData){
        FirebaseService.addData(`users/${userData.id}/appuntamenti`,appointment); // Aggiungi questa riga per salvare i dati su Firebase
        }else{
          console.error("medic not found")
        }
        setAppointment(emptyAppointment)
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
                    <span style={{ color: 'yellow' }}>•</span>
                </div>
                );
            }
    }


  

    return(
        <>
        <div className = "all">

            <Calendar onClickDay={handleClick} tileContent={tileContent} className = "calendar"/>
              
                {activeDate && (
                    <div>
                      <Button onClick={() => setShowForm(true)}>crea nuovo appuntamento</Button>
                      <Button onClick={() => setActiveDate(null)}>esci</Button>
                    </div>
                )}

                {showForm && activeDate && (                    //se activeDate e' truthy (non null o undefined) allora renderizza
                 <div className="modal-overlay">
                  <div className="modal-content">
                    
                    <h1 className="title">Crea Appuntamento</h1>

                    <div className="inputs">
                      <Input name = "data" type="data" placeholder="Data" defaultValue={activeDate.toDateString()}/>
                      <Input name = "orario" type="string" placeholder="Orario" onChange={handleChange} value = {appointment.orario}/>
                      <Input name = "paziente" type="string" placeholder="Paziente" onChange={handleChange} value = {appointment.paziente}/>
                      <Input name = "descrizione" type="string" placeholder="Descrizione" onChange={handleChange} value = {appointment.descrizione} />

                    </div>

                    <div className="buttons">
                      <Button onClick={handleSubmit}>Submit</Button>
                      <Button onClick={() => {setActiveDate(null); setAppointment(emptyAppointment); setShowForm(false)}}>Annulla</Button>
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


//Invece di una collezione in root, crea una sottocollezione appuntaenti per ogni utente medico???


//mostra lista appuntamenti se premi sul giorno