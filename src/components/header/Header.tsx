import './Header.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import { faCircleUser } from '@fortawesome/free-solid-svg-icons';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import FirebaseService from '@/services/FirebaseService';
import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Notifiche } from '../notifiche/notifiche';
import { NotifInterface } from '../notifiche/NotifInterface';
import { Appointments } from '../calendario/appointmentInterface';
import { fetchAppointments } from '../calendario/appointments';

//import {Link} from 'react-router-dom'

function Header(){
    const oneDayMs = 86400000
    const navigate = useNavigate();
    
    const {
            authUser
    } = useAuth();
        
    // stati per notifiche
    const [notifications, setNotifications] = useState<NotifInterface[] | any>(null);
    const [appointments, setAppointments] = useState<Appointments[] | any>(null);
    const [userData, setUserData] = useState<any>(null)
    const [error, setError] = useState<string | null>(null);

    const [showNotifications, setShowNotifications] = useState(false);

    //FETCH
    const fetchUser = async () => {
          const userData = await FirebaseService.findPatientByEmail(authUser.email)
                if(!userData) return;
            setUserData(userData)

    }
    const fetchNotif = async () => {
            try{
                console.log(userData.id)
                const userNotifs = await FirebaseService.getNotifications(userData.id)
                setNotifications(userNotifs)
                
            }catch (err) {
                setError("Errore nel recupero delle notifiche")
            }
      }
      const fetchUserAppointments = async () => {

            try{
                       const userApp = await fetchAppointments(userData.id);
                        setAppointments(userApp); // or do something with it
                        console.log("APPUNTAMENTI: ", userApp)//rimuovere
            }catch (err) {
                setError("Errore nel recupero degli appuntamenti")
            }

      }
      

         //quando un appuntamento futuro dista 1 giorno dalla data corrente, allora invia notifica al database
    const notif = (appointments: Appointments[]) => {
        const futureAppointments = appointments
                                              .filter((a: Appointments ) => (new Date(a.data ?? '')).getTime() >= (new Date().getTime() - oneDayMs))        //prende >= a oggi
              
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() +1  );  
        tomorrow.setHours(0, 0, 0, 0);  
      
        const approachingAppointments = futureAppointments.filter((a) => {
                const futureApp = new Date(a.data ?? '');
                futureApp.setHours(0, 0, 0, 0);
                
                return futureApp.getTime() >= (tomorrow.getTime() - oneDayMs) && futureApp.getTime() <= tomorrow.getTime() + oneDayMs ;
        });
      
        approachingAppointments.forEach((a) => {
    
            const notification = {
        
                        appointmentId: a.id,
                        userId: userData.id,
                        title: `Appuntamento: ${a.data}`,
                        body: a.descrizione,
                        time: a.orarioInizio,
                        date: a.data,
                        read: false
                         
                        
            };
                
            if (!notifications?.find((n: NotifInterface) => n.appointmentId === a.id)) {
                        FirebaseService.addData(`/users/${userData.id}/notifiche`, notification);
                        setNotifications((prevNotifications: NotifInterface[]) => [
                                 ...prevNotifications,
                                    notification
                        ]);

            }
            
        });
            console.log("NOTIFICHE: ", notifications)
          } 

      //Al primo render:
       useEffect(() => {
              fetchUser()    
        }, []);

        useEffect(() => {
                if (userData) {
                    fetchNotif();
                    fetchUserAppointments();
                }
        }, [userData]);

          useEffect(() => {
                if (userData && appointments) {
                    notif(appointments)
                }
        }, [userData && appointments]);
        
      
    

    const handleLogout = async () => {
        try {

          localStorage.removeItem('authUser');
          localStorage.removeItem('isLoggedIn');
          localStorage.removeItem('isPatient');
          localStorage.removeItem('isMedic');
          await FirebaseService.logout();
          console.log("Utente disconnesso");
          // Se usi react-router:
          // navigate("/login");  // oppure useNavigate da 'react-router-dom'
        } catch (error) {
          console.error("Errore nel logout:", error);
        }
      };



    return(
        <>
            <nav className="nav">
            <img src="/src/assets/pharmaCare.png" alt="logo" className='logo' onClick={() => {navigate('/home')}}/>

                <div className='dati'>
                    <p className='header-text' onClick={() => {handleLogout(); navigate("/login")} }>Log out</p>
                    <FontAwesomeIcon icon={faCalendar} onClick = {() => navigate("")} className='header-icon'/>
                    <FontAwesomeIcon icon={faBell}  onClick = {() => setShowNotifications(!showNotifications)} className='header-icon'/>
                    <FontAwesomeIcon icon={faCircleUser}  onClick = {() => navigate("")} className='header-icon'/>
                </div>
            </nav>

            {showNotifications && notifications && (
                <Notifiche notifications={notifications} setNotifications={setNotifications} className='show'/>
            )}

        </>
    )
}

export default Header;