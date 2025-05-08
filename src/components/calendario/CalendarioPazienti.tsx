
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css';
import { useState, useEffect } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import './CalendarioPazienti.css'
import FirebaseService from '@/services/FirebaseService';
import {useAuth} from '../contexts/AuthContext'
import {AppointmentsList, fetchAppointments} from './appointments';
import app from '@/configurations/FirebaseConfig';

interface Appointments{
  id: number,
  data: string,
  orarioInizio: string,
  orarioFine: string,
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
    const [notifications, setNotifications] = useState<any[] | null>(null);
    
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

        const fetchNotif = async () => {

            const userNotifs = await FirebaseService.getNotifications(userId)
            setNotifications(userNotifs)
        }
    
        fetch();
        fetchNotif();

     
    }, [userId])

    useEffect(() => {
        
        console.log("AOOOOOAOO")
        if(appointments)
        notif(appointments)
  
       
      }, [appointments])
    

 
    

   
    
  
    
    //EVENTI


    //aggiorna la data selezionata
    const handleClick = (date: Date) => {   
        setActiveDate(date);

        console.log(userId, activeDate, appointments)
        return null;
    }
    

    //quando un appuntamento futuro dista 1 giorno dalla data corrente, allora invia notifica al database
    const notif = (appointments: Appointments[]) => {
        const futureAppointments = appointments
                                        .filter((a: Appointments ) => new Date(a.data) >= new Date())
        
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);  
        tomorrow.setHours(0, 0, 0, 0);  

        const approachingAppointments = futureAppointments.filter((a) => {
          const futureApp = new Date(a.data);
          futureApp.setHours(0, 0, 0, 0);
          return futureApp.getTime() === tomorrow.getTime();
        });

        approachingAppointments.forEach((a) => {
          
      
          const notification = {
              appointmentId: a.id,
              time: a.orarioInizio,
              title: `Appuntamento ${a.data}`,
              payload: `Il seguente appuntamento è stato programmato per domani:\n ${a.descrizione}`,
            
          };
      
          if (!notifications?.find(n => n.appointmentId === a.id)) {
              FirebaseService.addData(`/users/${userId}/notifiche`, notification);
          }
      });

    } 
  



    const tileClassName = ({ date, view }: { date: Date; view: string }) => {
        if (
          view === 'month' &&
          appointments?.some((apt) => apt.data === date.toDateString())
        ) {
          return 'tile-with-appointment';
        }
        return null;
      };


    //RENDER
    return(
        <>
        <div className = "all">

                {(loading || !authUser || !userId) && (   //se authUser e userId non sono inizializzati, mostra caricamento, DA FARE        
                    <div>loading users</div>
                )}
            
            
                <Calendar onClickDay={handleClick} tileClassName={tileClassName} className = "calendar"/>
            

                

                {activeDate && userId && appointments &&(             //se premi una tile (activeDate) mostra lista appuntamenti
                    <div className = "boxAppuntamenti">
                          <ul className="listaAppuntamenti">
                                <p>Appuntamenti  {activeDate.toDateString()}:</p>
                              {appointments
                              .filter((apt) => apt.data === activeDate.toDateString())
                              .map((apt) => (
                                  <li key = {apt.mailPaziente}>
                                      {apt.id} - {apt.data} - {apt.orarioInizio} - {apt.orarioFine} - {apt.paziente} - {apt.mailPaziente} - {apt.descrizione}
                                     
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
