import React from 'react'
import './notifiche.css'
import { NotifInterface } from './NotifInterface'
import FirebaseService from '@/services/FirebaseService'




export function Notifiche({notifications, setNotifications, className = ""} : {notifications: NotifInterface[], 
                                                                                    setNotifications: React.Dispatch<React.SetStateAction<NotifInterface[]>>,
                                                                                    className: string}){

    
    const markAsRead = async (notificationId: string | undefined, userId: string) => {

        await FirebaseService.markNotifAsRead(notificationId, userId)
          setNotifications(prev =>
                prev.filter(n => n.id !== notificationId)
          )
    }


    return(

        <div className = "tendinaNotifiche">
            <ul>
                 <b className='title'>APPUNTAMENTI</b>
                {notifications
                    .filter((n) => {
                        const apptDate = new Date(n.date)
                        apptDate.setHours(0,0,0)
                        const yesterday = new Date()
                        yesterday.setDate(yesterday.getDate()-1)
                        yesterday.setHours(0,0,0)
                     
                        return apptDate >= yesterday
                    })
                    .filter((n) => n.read === false)
                    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())    //ordina in  maniera crescente, usa il CompareTo, (se negativo, a prima di b)
                    .map((n) => (
                                                            //aggiungere attributi a notifiche
                        <li key = {n.id}>   
                  
                            <b>Data: </b>{n.date} <br/>
                            <b>Titolo: </b>{n.title} <br/>
                            <b>Descrizione: </b>{n.body} <br/>
                            <b>Orario: </b>{n.time} <br/>
                            <button onClick = {() => markAsRead(n.id, n.userId)}>segna come letto</button>
                        </li>
                    ))
                
                }

            </ul>
        </div>

    )
}