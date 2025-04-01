import './App.css'
import Footer from './components/footer/Footer';
import Header from './components/header/Header';
import Home from './components/home/Home';
import SignIn from './components/signup_login/SignIn';
import SignUp from './components/signup_login/SignUp';
import {BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import User from './components/user/User';


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
    return(
        <>
            <Router>
                <Routes>
                    <Route path = "/" element = {<SignIn/>}/>    
                    <Route path = "/signup" element = {<SignUp/>}/> 
                    <Route path = "/home" element = {<Impaginazione><Home/></Impaginazione>} />
                    <Route path = "*" element={<Navigate to="/" replace />}/>   
                    <Route path = "/user" element = {<Impaginazione><User/></Impaginazione>} />
                </Routes>
            </Router>
        </>
    )
}

export default App;