import './App.css'
import Footer from './components/footer/Footer';
import Header from './components/header/Header';
import Home from './components/home/Home';
import SignIn from './components/signup_login/SignIn';
import SignUp from './components/signup_login/SignUp';
import {BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import User from './components/user/User';
import Profilo from './components/user/profilo/Profilo';
import Registro from './components/user/registro/Registro';
import Piano from './components/user/piano/Piano';




function Impaginazione({ children } : any){
    return (
        <>  
            <Header></Header>
            <div className='container'>{children}</div>
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