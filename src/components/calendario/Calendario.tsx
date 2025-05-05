
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

function Calendario(){

    //estrai contesto
    const {
        authUser,
        loading
    } = useAuth();

    

    
    const emptyAppointment: Appointments = {
      id: 0,
      data: "",
      orario: "",
      paziente: "",
      mailPaziente: "",
      descrizione: "" 
    };

 
    
    //HOOKS
    
    const [activeDate, setActiveDate] = useState<Date | null>(null)
    const [showForm, setShowForm] = useState<boolean | null>(null)
   
    

    const [appointment, setAppointment] = useState<Appointments>(emptyAppointment)
    const [appointments, setAppointments] = useState<any[] | null>(null);

    const [users, setUsers] = useState<User[] | null>(null)
    const [userId, setUserId] = useState<string| null>(null);

    //EFFECTS


    //aggiorna la data del appuntamento - ogni volta che premi una casella nuova 
    useEffect(() => {
      setAppointment(appointment => ({
        ...appointment,
        data: activeDate?.toDateString() || "",
      }));
    }, [activeDate]);

    //estrae l'id del documento dello User - ogni volta che cambia authUser
    useEffect(() => {
      if (!authUser?.email) return;

      const fetchUserDocId = async () => {
        
        const userData = await FirebaseService.findMedicByEmail(authUser.email)
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

        const fetchUsers = async () => {
          const allUsers = await FirebaseService.getAllUsers();
          const soloPazienti = allUsers.filter(user => user.paziente === true);
          setUsers(soloPazienti);
        }

     
    }, [userId])
    

 
 

   
    
  
    
    //EVENTI

    //aggiorna lappuntamneot corrente quando variano gli input
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setAppointment({
          ...appointment,
          [e.target.name]: e.target.value,
         
      })
    }

    //aggiorna la data selezionata
    const handleClick = (date: Date) => {   
        setActiveDate(date);
        return null;
    }
    
    //assegna ID al appuntamento, salva apuntamento su firestore
    const handleSubmit = async () => {

     
        if(userId){

          //trovo id massimo
          const maxId = appointments && appointments.length > 0   //se esiste appointments, e ce almeno un appuntamento
          ? Math.max(...appointments.map((a) => a.id))     //trova il massimo tra un array di tutti gli id, se non ha id, mette 0
          : 0;                                                    //se e il primo appuntamenot mette 0

          //creo nuovo appuntamento con l'id trovato, non uso setAppointment perche asincrono
          const newAppointment = {          
            ...appointment,
            id: maxId + 1
          };
        
        await FirebaseService.addData(`users/${userId}/appuntamenti`,newAppointment); // salva dati su firestore
        //ricerco paziente con newApp.mailPaziente e metto app anche nella sua subcollection
        
        const patient = await FirebaseService.findPatientByEmail(newAppointment.mailPaziente)
        if(patient)
          await FirebaseService.addData(`users/${patient?.id}/appuntamenti`,newAppointment); // salva dati su firestore
        else console.log(patient)

        const updatedAppointments = await fetchAppointments(userId);
        setAppointments(updatedAppointments);

        }else{
          console.error("medic not found")
        }

        setAppointment(emptyAppointment)
        setActiveDate(null);
        setShowForm(false)
      };

  

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
            

                

                {activeDate && !showForm && userId && (             //se premi una tile (activeDate) mostra lista appuntamenti
                    <div className = "appList">
                      <div>
                        <Button onClick={() => setShowForm(true)}>crea nuovo appuntamento</Button>
                        <AppointmentsList medicDocumentId= {userId} activeDate = {activeDate.toDateString()}></AppointmentsList>
                        <Button onClick={() => setActiveDate(null)}>esci</Button>
                      </div>

                    </div>
                )}

                {showForm && activeDate && (                    //se activeDate e' truthy (non null o undefined) e showform e true allora renderizza (inserzione appuntamento)
                 <div className="modulo-overlay">
                  <div className="modulo-content">
                    
                    <h1 className="title">Crea Appuntamento</h1>

                    <div className="inputs">
                      <Input name = "data" type="data" placeholder="Data" defaultValue={activeDate.toDateString()}/>
                      <Input name = "orario" type="string" placeholder="Orario" onChange={handleChange} value = {appointment.orario}/>
                      <Input name = "paziente" type="string" placeholder="Paziente" onChange={handleChange} value = {appointment.paziente}/>
                      <Input name = "mailPaziente" type="string" placeholder="e-mail" onChange={handleChange} value = {appointment.mailPaziente}/>
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


export default Calendario

//https://www.npmjs.com/package/react-calendar


//modifica appuntamenti

//inserisci appuntamenti anche nel paziente: ogni app ha mail paziente  


//!contenuto tile non cambia quando fai remove