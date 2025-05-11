import './App.css'
import Footer from './components/footer/Footer';
import Header from './components/header/Header';
import Home from './components/home/Home';
import SignIn from './components/signup_login/SignIn';
import SignUp from './components/signup_login/SignUp';
import Calendario from './components/calendario/Calendario';
import {ProtectedRoute} from './components/contexts/ProtectedRoute';
import {useAuth} from './components/contexts/AuthContext'
import {BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import User from './components/user/User';

/* ICON */
import CreaFarmaci from './components/crea-farmaci/CreaFarmaci';
import CreaPazienti from './components/crea-pazienti/CreaPazienti';
import CreaPiani from './components/crea-piani/CreaPiani';
import ModificaPiano from './components/modifica-piano/ModificaPiano';
import CalendarioPazienti from './components/calendario/CalendarioPazienti';
import FarmacoPage from './components/farmaco/Farmaco';

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
        } = useAuth();    
        

    
    return(
        <>
            <Router>
                <Routes>
                   
                    {/* ACCESSO  */}
                    <Route path = "/login" element = {<SignIn/>}/> 
                    <Route path = "/signup" element = {<SignUp/>}/> 

                    {/* HOME */}
                    <Route path="/home" element={<Impaginazione><Home /></Impaginazione>} />

                    {/* GESTIONE UTENTI */}
                    <Route path="/crea-paziente" element={<Impaginazione><CreaPazienti></CreaPazienti></Impaginazione>} />
                    <Route path="/user/:view/:slug" element={<Impaginazione><User /></Impaginazione>} />
                    <Route path="/user/crea-piano/:slug" element={<Impaginazione><CreaPiani /></Impaginazione>} />
                    <Route path="/user/piano/:slug/:idPiano" element={<Impaginazione><ModificaPiano /></Impaginazione>} />
                    
                    {/* GESTIONE FARMACI */}
                    <Route path="/crea-farmaco" element={<Impaginazione><CreaFarmaci /></Impaginazione>} /> 
                    <Route path="/farmaco/:slug" element={<Impaginazione><FarmacoPage /></Impaginazione>} /> 

                    {/* CALENDARIO */}
                    <Route path="/calendar" element={<Impaginazione><Calendario /></Impaginazione>} />
                    <Route path = "/calendarPazienti" element = {<CalendarioPazienti/>}/>

                    {/* DEFAULT ROUTE */}
                    <Route path = "*" element={<Navigate to="/login" replace />}/>  

                    
                    
                    
                    

                    // route protette condivise
                    <Route element={<ProtectedRoute isAuthenticated={isLoggedIn} isPatient={isPatient} isMedic={isMedic} requiredRole='all'/>}>
                        
                    </Route>
                    
                    //route protette per i Pazienti
                    <Route element={<ProtectedRoute isAuthenticated={isLoggedIn} isPatient={isPatient} isMedic={isMedic} requiredRole='patient' />}>
                        
                    </Route>



                    //route protette per i Medici
                    <Route element={<ProtectedRoute isAuthenticated={isLoggedIn} isPatient={isPatient} isMedic={isMedic} requiredRole='medic' />}>
                        
                    </Route>

                    

                     

                </Routes>
            </Router>
        </>
    )
}

export default App;