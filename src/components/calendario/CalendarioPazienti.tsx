
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css';
import { useState, useEffect } from 'react';
import './CalendarioPazienti.css'
import FirebaseService from '@/services/FirebaseService';
import {useAuth} from '../contexts/AuthContext'
import {AppointmentsList, fetchAppointments} from './appointments';
import { useNavigate, useParams } from 'react-router-dom';

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

  
    const { slug } = useParams();
    const navigate = useNavigate();


    useEffect(() => {
      if(slug)
        setUserId(slug.split('-')[0]);
      else
        return;

  },[slug, navigate]);

    //estrai contesto
    const {
        authUser,
        loading
    } = useAuth();
 
    
    //HOOKS
    
    const [activeDate, setActiveDate] = useState<Date | null>(null)
   
    

   
    const [appointments, setAppointments] = useState<any[] | null>(null);
  
    
    const [userId, setUserId] = useState<string| null>(null);
    

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


    //aggiorna la data selezionata
    const handleClick = (date: Date) => {   
        setActiveDate(date);

        console.log(userId, activeDate, appointments)
        return null;
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

                {/* {(loading || !authUser || !userId) && (   //se authUser e userId non sono inizializzati, mostra caricamento, DA FARE        
                    <div>loading users</div>
                )} */}
            
            
                <Calendar onClickDay={handleClick} tileClassName={tileClassName} className = "calendar"/>
            

                

                {activeDate && userId && appointments &&(             //se premi una tile (activeDate) mostra lista appuntamenti
                    <div className = "listaPaz">
                      <p> <b className='title'>Appuntamenti  {activeDate.toDateString()}: </b></p>
                          <ul className="listaAppuntamenti">
                                
                              {appointments
                              .filter((apt) => apt.data === activeDate.toDateString())
                              .map((apt) => (
                                  <li key = {apt.id} className='elementoLista'>
                                      <b>Data: </b> {apt.data} <br/>  
                                      <b>Inizio/fine: </b>  {apt.orarioInizio} - {apt.orarioFine} <br /> 
                                      <b>Info paziente: </b>{apt.paziente} - {apt.mailPaziente} <br />  
                                      <b>Descrizione: </b> {apt.descrizione} <br />
                                     
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
