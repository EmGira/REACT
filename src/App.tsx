import './App.css'
import Footer from './components/footer/Footer';
import Header from './components/header/Header';
import Home from './components/home/Home';
import SignIn from './components/signup_login/SignIn';
import SignUp from './components/signup_login/SignUp';
import {BrowserRouter as Router, Route, Routes } from 'react-router-dom'

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
                </Routes>
            </Router>
        </>
    )
}

export default App;