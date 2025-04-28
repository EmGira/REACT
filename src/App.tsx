import './App.css'
import Footer from './components/footer/Footer';
import Header from './components/header/Header';
import Home from './components/home/Home';
import SignIn from './components/signup_login/SignIn';
import SignUp from './components/signup_login/SignUp';
import CalendarComponent from './components/calendario/Calendario';
import ProtectedRoute from './components/signup_login/ProtectedRoute';
import {useAuth} from './components/contexts/AuthContext'
import {BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import User from './components/user/User';
import Profilo from './components/user/profilo/Profilo';
import Registro from './components/user/registro/Registro';
import Piano from './components/user/piano/Piano';




function Impaginazione({ children } ){
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
        } = useAuth();          //tira fuori i valori Context del utente con useContext e li assegna alla struttura
        
    return(
        <>
            <Router>
                <Routes>
                   
                    <Route path = "/" element = {<SignIn/>}/>  
                    
                    <Route path = "/signup" element = {<SignUp/>}/> 

                    <Route path = "/calendar" element = {<CalendarComponent/>}/> 

                    //route protette
                    <Route element={<ProtectedRoute isAuthenticated = {isLoggedIn} />}>
                        <Route path = "/home" element = {<Impaginazione><Home/></Impaginazione>} />

                    </Route>

                    <Route path = "*" element={<Navigate to="/" replace />}/>   
                    <Route path="/user" element={<Impaginazione><User /></Impaginazione>}>
                        <Route path="profilo" element={<Profilo />} />
                        <Route path="registro" element={<Registro />} />
                        <Route path="piano" element={<Piano />} />
                    </Route>
                </Routes>
            </Router>
        </>
    )
}

export default App;