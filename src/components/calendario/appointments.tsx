import { useEffect, useState } from "react";
import FirebaseService from '@/services/FirebaseService';

    export const fetchAppointments = async (medicDocumentId: string) => {
        const [appointments, setAppointments] = useState<any[] | null>(null);
        const data = await FirebaseService.getMedicAppointments(medicDocumentId)
        setAppointments(data);
        return appointments
    }

    export const AppointmentsList = ({medicDocumentId, activeDate} : {medicDocumentId: string, activeDate: string}) => {
    
        const [appointments, setAppointments] = useState<any[] | null>(null);
        const [loading, setLoading] = useState(true);
    
        useEffect(()=> {

            const fetchAppointments = async () => {
            
                const data = await FirebaseService.getMedicAppointments(medicDocumentId)
                
                setAppointments(data);
                setLoading(false);
     
            }
    
            fetchAppointments();
    
        }, [medicDocumentId])


        if (loading) return <div>Loading appointments...</div>;
        if (!appointments) return <div>No appointments found.</div>;

        return(

            <div>
                <h1>APPUNTAMENTI PROGRAMMMATI</h1>
                <ul>
                    {appointments
                    .filter((apt) => apt.data === activeDate)
                    .map((apt) => (
                        <li key = {apt.mailPaziente}>
                            {apt.data} - {apt.orario} - {apt.paziente} - {apt.mailPaziente} - {apt.descrizione}
                        </li>
                    ))}
                </ul>

            </div>

        )

    }

    

