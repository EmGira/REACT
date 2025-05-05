
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css';
import { useState, useEffect } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import './Calendario.css'
import FirebaseService from '@/services/FirebaseService';
import {useAuth} from '../contexts/AuthContext'
import {AppointmentsList, fetchAppointments} from './appointments';

interface Appointments{
  id: number,
  data: string,
  orario: string,
  paziente: string,
  mailPaziente: string,
  descrizione: string
}

interface User{
  email: string,
  password: string,
  nome: string,
  cognome: string,
  sesso: string,
  birthDate: string,
  comune: string,
  codiceFiscale: string,
  paziente: boolean,
  telefono: number | undefined,
  nazione: string,
  provincia: string,
  indirizzo: string
}

function CalendarioPazienti(){

    //estrai contesto
    const {
        authUser,
        loading
    } = useAuth();

    

    

 
    
    //HOOKS
    
    const [activeDate, setActiveDate] = useState<Date | null>(null)
   
    

   
    const [appointments, setAppointments] = useState<any[] | null>(null);
    
    
    const [userId, setUserId] = useState<string| null>(null);
    const [users, setUsers] = useState<User | null>(null);

    //EFFECTS


   

    //estrae l'id del documento dello User - ogni volta che cambia authUser
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


    //aggiorna la lista degli appuntamenti presenti nel Db - ogni volta che cambia userId
    useEffect(() => {
      
      if(!userId) {return}   //se non e ancora definito userId nonesegue 
      //altrimenti:
   
      
        const fetch = async () => {
            
            const userApp = await fetchAppointments(userId);
            setAppointments(userApp); // or do something with it

        };
    
        fetch();

     
    }, [userId])
    

 
 

   
    
  
    
    //EVENTI

    //aggiorna lappuntamneot corrente quando variano gli input
 

    //aggiorna la data selezionata
    const handleClick = (date: Date) => {   
        setActiveDate(date);

        console.log(userId, activeDate, appointments)
        return null;
    }
    
    //assegna ID al appuntamento, salva apuntamento su firestore
   

  

    //modifica contenuto della tile - mostrap untino rosso su le tile che hanno appuntamenti
    const tileContent = ({date, view}: { date: Date; view: string }) => {     
    
        if (view === 'month' && appointments && appointments.some((apt) => apt.data === date.toDateString()))        //some: controlla se almeno un elemento soddisfa la condizione, se Si termina
                return ( 
                        <div>
                            <span style={{ color: 'red' }}>•</span>
                        </div>
                )
    }


    //RENDER
    return(
        <>
        <div className = "all">

                {(loading || !authUser || !userId) && (   //se authUser e userId non sono inizializzati, mostra caricamento, DA FARE        
                    <div>loading users</div>
                )}
            
            
                <Calendar onClickDay={handleClick} tileContent={tileContent} className = "calendar"/>
            

                

                {activeDate && userId && appointments &&(             //se premi una tile (activeDate) mostra lista appuntamenti
                    <div>
                          <ul className="listaAppuntamenti">
                              {appointments
                              .filter((apt) => apt.data === activeDate.toDateString())
                              .map((apt) => (
                                  <li key = {apt.mailPaziente}>
                                      {apt.id} - {apt.data} - {apt.orario} - {apt.paziente} - {apt.mailPaziente} - {apt.descrizione}
                                     
                                  </li>
                                
                              ))} 
                          </ul>

                    </div>
                )}

  

        </div>
        </>
    )
}


export default CalendarioPazienti

//https://www.npmjs.com/package/react-calendar


//modifica appuntamenti

//inserisci appuntamenti anche nel paziente: ogni app ha mail paziente  


//!contenuto tile non cambia quando fai remove


//il paziente

//vede i suoi appuntamenti
