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
import HomePaziente from './components/home/HomePaziente';

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
 
                    <Route path = "/login" element = {<SignIn/>}/> 
                    <Route path = "/signup" element = {<SignUp/>}/> 

                    {/* route protette condivise */}
                    <Route element={<ProtectedRoute isAuthenticated={isLoggedIn} isPatient={isPatient} isMedic={isMedic} requiredRole='all'/>}>
                        <Route path="/user/piano/:slug/:idPiano" element={<Impaginazione><ModificaPiano /></Impaginazione>} />
                        <Route path="/user/:view/:slug" element={<Impaginazione><User /></Impaginazione>} />
                    </Route>
                    
                    {/* route protette per i Pazienti */}
                    <Route element={<ProtectedRoute isAuthenticated={isLoggedIn} isPatient={isPatient} isMedic={isMedic} requiredRole='patient' />}>
                        <Route path="/homePaziente" element={<Impaginazione><HomePaziente /></Impaginazione>} />
                    </Route>

                    {/* route protette per i Medici */}
                    <Route element={<ProtectedRoute isAuthenticated={isLoggedIn} isPatient={isPatient} isMedic={isMedic} requiredRole='medic' />}>
                        <Route path="/home" element={<Impaginazione><Home /></Impaginazione>} />
                        <Route path="/crea-paziente" element={<Impaginazione><CreaPazienti></CreaPazienti></Impaginazione>} />
                        <Route path="/crea-farmaco" element={<Impaginazione><CreaFarmaci /></Impaginazione>} /> 
                        <Route path="/farmaco/:slug" element={<Impaginazione><FarmacoPage /></Impaginazione>} /> 
                        <Route path="/user/crea-piano/:slug" element={<Impaginazione><CreaPiani /></Impaginazione>} />
                    </Route>

                    <Route path = "*" element={<Navigate to="/login" replace />}/>  

                </Routes>
            </Router>
        </>
    )
}

export default App;