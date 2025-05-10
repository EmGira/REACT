import './notifiche.css'
import { NotifInterface } from './NotifInterface'




export function Notifiche({notifications, className = ""} : {notifications: NotifInterface[], className: string}){

    


    return(

        <div className = "tendinaNotifiche">
            <ul>
                 <b className='title'>APPUNTAMENTI</b>
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