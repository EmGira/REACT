import './App.css'
import Footer from './components/footer/Footer';
import Header from './components/header/Header';
import Home from './components/home/Home';
import SignIn from './components/signup_login/SignIn';
import SignUp from './components/signup_login/SignUp';
import ProtectedRoute from './components/signup_login/ProtectedRoute';
import {useAuth} from './components/contexts/AuthContext'
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

    const {
        isLoggedIn,
        } = useAuth();          //tira fuori i valori Context del utente con useContext e li assegna alla struttura
        
    return(
        <>
            <Router>
                <Routes>

                    <Route path = "/" element = {<SignIn/>}/>    
                    <Route path = "/signup" element = {<SignUp/>}/> 

                    //route protette
                    <Route element={<ProtectedRoute isAuthenticated = {isLoggedIn} />}>
                        <Route path = "/home" element = {<Impaginazione><Home/></Impaginazione>} />
                    </Route>

                </Routes>
            </Router>
        </>
    )
}

export default App;