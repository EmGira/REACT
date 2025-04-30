import './App.css'
import Footer from './components/footer/Footer';
import Header from './components/header/Header';
import Home from './components/home/Home';
import SignIn from './components/signup_login/SignIn';
import SignUp from './components/signup_login/SignUp';
import CalendarComponent from './components/calendario/Calendario';
import {ProtectedRoutePatients, ProtectedRoute} from './components/contexts/ProtectedRoute';
import {useAuth} from './components/contexts/AuthContext'
import {BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import User from './components/user/User';

/* ICON */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell } from '@fortawesome/free-solid-svg-icons'
import CreaFarmaci from './components/crea-farmaci/CreaFarmaci';
import CreaPazienti from './components/crea-pazienti/CreaPazienti';
import CreaPiani from './components/crea-piani/CreaPiani';
 './components/crea-pazienti/CreaPazienti.tsx';





function Impaginazione({ children }: any){
    return (
        <>  
            <Header></Header>
            {children}
            <Footer></Footer>
        </>
    )
}

function App(){

    const {
        isLoggedIn,
        isPatient,
        isMedic
        } = useAuth();          //tira fuori i valori Context del utente con useContext e li assegna alla struttura
        
    return(
        <>
            <Router>
                <Routes>
                   
                    <Route path = "/" element = {<SignIn/>}/> 

                    <Route path = "/signup" element = {<SignUp/>}/> 

                    //route protette condivise
                    <Route element={<ProtectedRoute isAuthenticated={isLoggedIn} isPatient={isPatient} isMedic={isMedic} />}>
                        <Route path="/home" element={<Impaginazione><Home /></Impaginazione>} />
                    </Route>
                    
                    //route protette per i Pazienti
                    <Route element={<ProtectedRoute isAuthenticated={isLoggedIn} isPatient={isPatient} isMedic={isMedic} requiredRole='patient' />}>
                        <Route path="/user/:view/:slug" element={<Impaginazione><User /></Impaginazione>}/>
                    </Route>

                    //route protette per i Medici
                    <Route element={<ProtectedRoute isAuthenticated={isLoggedIn} isPatient={isPatient} isMedic={isMedic} requiredRole='medic' />}>
                        <Route path="/calendar" element={<Impaginazione><CalendarComponent /></Impaginazione>} />
                        
                    </Route>

                    <Route path="/crea-paziente" element={<Impaginazione><CreaPazienti></CreaPazienti></Impaginazione>} />
                    <Route path="/crea-farmaco" element={<Impaginazione><CreaFarmaci /></Impaginazione>} />
                    <Route path="/user/crea-piano/:slug" element={<Impaginazione><CreaPiani /></Impaginazione>} />
                    

                    <Route path = "*" element={<Navigate to="/" replace />}/>   

                </Routes>
            </Router>
        </>
    )
}

export default App;