import { useEffect, useState } from "react";
import FirebaseService from '@/services/FirebaseService';
import { Button } from "../ui/button";
import { Input } from '../ui/input';
import './appointments.css'
import { Appointments } from "./appointmentInterface";
    export const fetchAppointments = async (medicDocumentId: string) => {
       
        const appointments = await FirebaseService.getMedicAppointments(medicDocumentId)

        return appointments
    }

    

   


    export const AppointmentsList = ({medicDocumentId, activeDate} : {medicDocumentId: string, activeDate: string}) => {
        const emptyAppointment: Appointments = {
            id: 0,
            data: "",
            orarioInizio: "",
            orarioFine: "",
            paziente: "",
            mailPaziente: "",
            descrizione: "" 
          };

        //HOOKS
        const [appointments, setAppointments] = useState<any[] | null>(null);
        const [loading, setLoading] = useState(true);
        const [showForm, setShowForm] = useState(false);
        const [chosenAppt, setChosenAppt] = useState<Appointments | null>(emptyAppointment);
    
        //EFFECTS
        useEffect(()=> {
            const fetchAppointments = async () => {
                const data = await FirebaseService.getMedicAppointments(medicDocumentId)
                setAppointments(data);
                setLoading(false);
            }
            fetchAppointments();
        }, [medicDocumentId])
      

        //EVENTS
        const handleClick = (apt: any) => {
            
            setShowForm(!showForm);
            setChosenAppt(apt);
            return null;
        }

        const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
            setChosenAppt({
                ...chosenAppt,
                [e.target.name]: e.target.value,
               
            })
          }

        const handleSubmit = async (chosenAppt: any) => {
            //aggiorna app medico
            await FirebaseService.updateApptByFieldId(medicDocumentId, chosenAppt.id, chosenAppt)   

            //aggiorna app paziente
            const patient = await FirebaseService.findPatientByEmail(chosenAppt.mailPaziente)
            if(patient)
                await FirebaseService.updateApptByFieldId(patient.id, chosenAppt.id, chosenAppt)   

            const data = await fetchAppointments(medicDocumentId)
            setAppointments(data)
            setShowForm(false)
        }
      
        const handleRemove = async (chosenAppt: any) => {
            await FirebaseService.DeleteApptByFieldId(medicDocumentId, chosenAppt.id)
            
            const patient = await FirebaseService.findPatientByEmail(chosenAppt.mailPaziente)
            if(patient)
                await FirebaseService.DeleteApptByFieldId(patient.id, chosenAppt.id)   

            const data = await fetchAppointments(medicDocumentId)
            setAppointments(data)
            setShowForm(false)
        }

        //RENDER
        if (loading) return <div>Loading appointments...</div>;
        if (!appointments) return <div>No appointments found.</div>;

        return(

            <div className= "lista">
                
                <ul>
                    {appointments
                    .filter((apt) => apt.data === activeDate)
                    .map((apt) => (
                        <li  key = {apt.id}>
                            <b>Data: </b> {apt.data} <br/>  
                            <b>Inizio/fine: </b>  {apt.orarioInizio} - {apt.orarioFine} <br /> 
                            <b>Info paziente: </b>{apt.paziente} - {apt.mailPaziente} <br />  
                            <b>Descrizione: </b> {apt.descrizione} <br />
                            <Button onClick={() => handleClick(apt)}>modifica</Button>

                                    {showForm && chosenAppt && chosenAppt.id === apt.id &&(
                                            <div className="inputs">
                                            
                                            <Input name = "data" type="data" placeholder="Data" defaultValue={activeDate}/>
                                            <Input name = "orarioInizio" type="string" placeholder="Orario inizio" onChange={handleChange} value = {chosenAppt.orarioInizio}/>
                                            <Input name = "orarioFine" type="string" placeholder="Orario fine" onChange={handleChange} value = {chosenAppt.orarioFine}/>
                                
                                            <Input name = "paziente" type="string" placeholder="Paziente" onChange={handleChange} value = {chosenAppt.paziente}/>
                                            <Input name = "mailPaziente" type="string" placeholder="e-mail" onChange={handleChange} value = {chosenAppt.mailPaziente}/>
                                            <Input name = "descrizione" type="string" placeholder="Descrizione" onChange={handleChange} value = {chosenAppt.descrizione} />
                                            <Button onClick = {() => handleSubmit(chosenAppt)}>Apply Changes</Button>
                                            <Button onClick = {() => handleRemove(chosenAppt)}>Remove</Button>
                                            
                                            </div>

                                    )}
                        </li>
                       
                    ))} 
                </ul>
                
              
            </div>

        )

    }

    

