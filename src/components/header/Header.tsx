import './Header.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import { faCircleUser } from '@fortawesome/free-solid-svg-icons';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { slugifyService } from '@/services/SlugifyService';
import FirebaseService from '@/services/FirebaseService';
import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Notifiche } from '../notifiche/notifiche';
import { NotifInterface } from '../notifiche/NotifInterface';
import { Appointments } from '../calendario/appointmentInterface';
import { fetchAppointments } from '../calendario/appointments';
import { Piano } from '@/models/piano.model';
import { Utente } from '@/models/Utente.model';



//import {Link} from 'react-router-dom'

function Header(){
    const oneDayMs = 86400000
    const navigate = useNavigate();
    
    const {
            authUser,
            isPatient,
            setIsLoggedIn,
            setIsMedic,
            setIsPatient
    } = useAuth();
        
    // stati per notifiche
    const [notifications, setNotifications] = useState<NotifInterface[] | any>(null);
    const [appointments, setAppointments] = useState<Appointments[] | any>(null);
    const [piani, setPiani] = useState<Piano[] | any>(null);
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

        const fetchPiani = async () => {
            try{
                const pianifetch = await FirebaseService.getPianiByIdPaziente(userData.id);
                setPiani(pianifetch); // or do something with it
                console.log("Piani: ", pianifetch);//rimuovere
            } catch (err) {
                setError("Errore nel recupero degli appuntamenti")
            }
        };



      


      

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

 const notifPiani = async (piani: Piano[]) => {
    const oggi = new Date();
    oggi.setHours(0, 0, 0, 0);
    const oggiTime = oggi.getTime();

    for (const piano of piani) {
        
        for (const farmaco of piano.farmaci || []) {
            // Recupera il documento farmaco da Firebase
            let nomeFarmaco = "Farmaco sconosciuto";
            try {
                const farmacoDoc = await FirebaseService.getFarmacoById(farmaco.id_farmaco);
                if (farmacoDoc && farmacoDoc.nome) {
                    nomeFarmaco = farmacoDoc.nome;
                }
            } catch (err) {
                console.error("Errore recupero farmaco:", err);
            }

            for (const assunzione of farmaco.assunzioni || []) {
                const dataAssunzione = new Date(assunzione.data);
                dataAssunzione.setHours(0, 0, 0, 0);

                if (dataAssunzione.getTime() === oggiTime) {
                    const notifica = {
                        userId: userData.id,
                        title: `Assunzione farmaco: ${nomeFarmaco}`,
                        body: `Oggi devi assumere ${farmaco.dose} mg, (${farmaco.periodo})`,
                        date: assunzione.data,
                        read: false
                    };

                    if (
                        !notifications?.find(
                            (n: NotifInterface) =>
                                n.title === notifica.title && n.date === notifica.date
                        )
                    ) {
                        await FirebaseService.addData(
                            `/users/${userData.id}/notifiche`,
                            notifica
                        );
                        setNotifications((prevNotifications: NotifInterface[]) => [
                            ...(prevNotifications || []),
                            notifica
                        ]);
                    }
                }
            }
        }
    }

    console.log("NOTIFICHE aggiornate piano:", notifications);
};

const notifPiani2 = async (piani: Piano[]) => {
    const oggi = new Date();
    oggi.setHours(0, 0, 0, 0);
    const oggiTime = oggi.getTime();

    const treGiorniDopo = new Date(oggiTime + 3 * 24 * 60 * 60 * 1000);

    for (const piano of piani) {
        if (!piano.data_fine) continue;

        const dataFine = new Date(piano.data_fine);
        dataFine.setHours(0, 0, 0, 0);

        if (dataFine.getTime() <= treGiorniDopo.getTime() && dataFine.getTime() >= oggiTime) {
            
            const notifica = {
                userId: userData.id,
                title: `Piano in scadenza: ${piano.id}`,
                body: `Il piano termina il ${dataFine.toLocaleDateString()}.`,
                date: piano.data_fine,
                read: false
            };

            // Controlla che non esista già la notifica
            if (
                !notifications?.find(
                    (n: NotifInterface) =>
                        n.title === notifica.title && n.date === notifica.date
                )
            ) {
                // Salva su Firebase
                await FirebaseService.addData(
                    `/users/${userData.id}/notifiche`,
                    notifica
                );
                // Aggiorna stato
                setNotifications((prevNotifications: NotifInterface[]) => [
                    ...(prevNotifications || []),
                    notifica
                ]);
            }
        }
    }
};


    
    const [currentUser, setCurrentUser] = useState<Utente | null>(null);
    const [currentUserId, setCurrentUserId] = useState('');


      //Al primo render:
       useEffect(() => {
              fetchUser()  
            FirebaseService.getCurrentUser().then((response: any) => {
              if(response){
                setCurrentUserId(response.uid);
                FirebaseService.getUserById(response.uid).then((response2: any) => {
                    setCurrentUser(response2 as Utente);
                    console.log(response2);
                });
              }
                
            });
        }, []);

        useEffect(() => {
                if (userData) {
                    fetchNotif();
                    fetchUserAppointments();
                    fetchPiani();
                }
        }, [userData]);


          useEffect(() => {
                if (userData && appointments && piani) {
                    notif(appointments)
                    notifPiani(piani)
                    notifPiani2(piani)
                }
        }, [userData && appointments && piani]);
        

    const handleLogout = async () => {
        try {

          localStorage.removeItem('authUser');
          localStorage.removeItem('isLoggedIn');
          localStorage.removeItem('isPatient');
          localStorage.removeItem('isMedic');
         setIsLoggedIn(false);
         setIsMedic(false);
         setIsPatient(false);

          await FirebaseService.logout();
          console.log("Utente disconnesso");
          // Se usi react-router:
          // navigate("/login");  // oppure useNavigate da 'react-router-dom'
        } catch (error) {
          console.error("Errore nel logout:", error);
        }
      };


    const goToProfile = () => {
        if(currentUser && currentUserId != null){
            const sluggedProfile = slugifyService.slugify(currentUserId, currentUser.nome, currentUser.cognome);
            navigate(`/user/profilo/` + sluggedProfile);
        }
    };


    return(
        <>
            <nav className="nav">
            <img src="/src/assets/pharmaCare.png" alt="logo" className='logo' onClick={() => {currentUser?.paziente? navigate('/homePaziente'): navigate('/home')}}/>

                <div className='dati'>
                    <p className='header-text' onClick={() => {handleLogout(); navigate("/login")} }>Log out</p>
                    {/* <FontAwesomeIcon icon={faCalendar} onClick = {() => navigate("")} className='header-icon'/> */}
                    <FontAwesomeIcon icon={faBell}  onClick = {() => setShowNotifications(!showNotifications)} className='header-icon'/>
                    <FontAwesomeIcon icon={faCircleUser}  onClick={goToProfile} className='header-icon'/>
                </div>
            </nav>

            {showNotifications && notifications && (
                <Notifiche notifications={notifications} setNotifications={setNotifications} className='show'/>
            )}

        </>
    )
}

export default Header;