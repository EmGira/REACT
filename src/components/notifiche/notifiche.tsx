import './notifiche.css'
import { NotifInterface } from './NotifInterface'




export function Notifiche({notifications} : {notifications: NotifInterface[]}){

    


    return(

        <div>
            <ul>
                 <b>APPUNTAMENTI</b>
                {notifications
                    .map((n) => (
                                                            //aggiungere attributi a notifiche
                        <li key = {n.appointmentId}>   
                            {n.title} <br/>
                            {n.payload} <br/>
                        </li>
                    ))
                
                }

            </ul>
        </div>

    )
}