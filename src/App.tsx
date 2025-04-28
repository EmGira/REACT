import './App.css'
import Footer from './components/footer/Footer';
import Header from './components/header/Header';
import Home from './components/home/Home';
import SignIn from './components/signup_login/SignIn';
import SignUp from './components/signup_login/SignUp';
import CalendarComponent from './components/calendario/Calendario';
import {useAuth} from './components/contexts/AuthContext'
import {BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import User from './components/user/User';





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

    const { isLoggedIn } = useAuth();  
        
    return(
        <>
            <Router>
                <Routes>
                   
                    <Route path = "/" element = {<SignIn/>}/> 

                    <Route path = "/signup" element = {<SignUp/>}/> 

                    <Route path = "/home" element = {<Impaginazione><Home/></Impaginazione>} />
                    
                    <Route path = "/calendar" element = {<CalendarComponent/>}/> 
                    {/* 
                    //route protette
                    <Route element={<ProtectedRoute isAuthenticated = {isLoggedIn} />}>
                        <Route path = "/home" element = {<Impaginazione><Home/></Impaginazione>} />

                    </Route> */}

                    

                    <Route path="/user/:view/:slug" element={<Impaginazione><User /></Impaginazione>}/>

                    <Route path = "*" element={<Navigate to="/" replace />}/>   

                </Routes>
            </Router>
        </>
    )
}

export default App;