
import { useState } from "react";
import FirebaseService from "../../services/FirebaseService"
import { useNavigate } from "react-router-dom";
import {useAuth} from '../contexts/AuthContext'
import './login.css'
import './SignIn.css'
/*import { Input } from '../ui/input';*/
import { Button } from '../ui/button';
import { Scale } from "lucide-react";

import { requestPermissionAndGetToken, saveTokenToBackend} from "../../services/Notification.ts"


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
                setAuthUser(userData)
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
                setAuthUser(userData);
                setIsMedic(true);

                localStorage.setItem('authUser', JSON.stringify(userData));
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('isMedic', 'true');
                localStorage.setItem('isPatient', 'false');

            
                navigate('/home')
            }
               
        } else
            console.log("User data not found");
        
    }

    const handleSignup = () => {
      
        navigate('/signup')
      
    }
    

    //RENDER
    return(
        <div className="body_signIn">
        <div className = "card_container_in">
            <img src="/src/assets/logo_pharmaCare.svg" alt="logoLogin" className='logoLogin'/>
            <b><h1 className="testo">Accedi!</h1></b>
            
            <div className="inputs">
                <label htmlFor="email">Email</label>
                <input id= "email" type = "email" onChange = {(e) => setEmail(e.target.value)} />
                <label htmlFor="password">Password</label>
                <input id="password" type = "password" onChange = {(e) => setPassword(e.target.value)}/> 
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