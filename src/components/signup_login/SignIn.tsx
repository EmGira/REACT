
import { useState } from "react";
import FirebaseService from "../../services/FirebaseService"
import { useNavigate } from "react-router-dom";
import {useAuth} from '../contexts/AuthContext'
import './SignIn.css'
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Scale } from "lucide-react";


function SignIn(){

    //HOOKS
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const {
        setAuthUser,
        setIsLoggedIn,
        setIsPatient,
        setIsMedic
        } = useAuth();
    //FUNCTIONS


    //On SignIn, esegue SignIn, prende data User, se paziente, va in home pazienti, altrimenti home medici
    const handleSubmit = async () => {
        const credential = FirebaseService.signIn(email, password);
        const userId = (await credential).uid
        const userData = await FirebaseService.getUserData(userId);
        
        

        if (userData) {
            if(userData.paziente == true){
                //Aggiorno contesto
                setIsLoggedIn(true);
                setAuthUser(userData.email)
                setIsPatient(true)
                
                 // Salvo in localStorage
                localStorage.setItem('authUser', JSON.stringify(userData));
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('isPatient', 'true');
                localStorage.setItem('isMedic', 'false');
           
                navigate('./home')
            }
            else if(userData.paziente ==false){
                setIsLoggedIn(true);
                setAuthUser(userData.email);
                setIsMedic(true);

                localStorage.setItem('authUser', JSON.stringify(userData));
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('isMedic', 'true');
                localStorage.setItem('isPatient', 'false');

            
                navigate('./calendar')
            }
               
        } else
            console.log("User data not found");
        
    }

    const handleSignup = () => {

        navigate('/signup')
      
    }
    

    //RENDER
    return(
        <div className="body_login">
        <div className = "card_container">
            <img src="/src/assets/logo_pharmaCare.svg" alt="logoLogin" className='logoLogin'/>
            <p className="testo">Sign into your account</p>
            {/*<h1 className="h1_login">SIGN IN</h1>*/}
            <div className="inputs">
                <Input type = "email" placeholder="email" onChange = {(e) => setEmail(e.target.value)} />
                <Input type = "password" placeholder="password" onChange = {(e) => setPassword(e.target.value)}/> 
            </div>

            <Button className="button_input" onClick = {handleSubmit}>Sign In</Button>

            <p className="p_login">Non hai un account? <a className="a_login" onClick={handleSignup}>Registrati qui</a></p>

            {/*<div className="buttons">
                <Button onClick = {handleSubmit}>Sign In</Button>
                *<Button onClick = {handleSignup}>Sign Up</Button>
            </div>*/}
        </div>
        </div>
    )
    

}


export default SignIn