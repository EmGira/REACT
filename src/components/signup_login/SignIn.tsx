
import { useState } from "react";
import FirebaseService from "../../services/FirebaseService"
import { useNavigate } from "react-router-dom";
import {useAuth} from '../contexts/AuthContext'
import './SignIn.css'

function SignIn(){

    //HOOKS
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const {
        setAuthUser,
        isLoggedIn,
        setIsLoggedIn
        } = useAuth();
    //FUNCTIONS


    //On SignIn, esegue SignIn, prende data User, se paziente, va in home pazienti, altrimenti home medici
    const handleSubmit = async () => {
        const credential = FirebaseService.signIn(email, password);
        const userId = (await credential).uid
        const userData = await FirebaseService.getUserData(userId);
        
        

        if (userData) {
            if(userData.paziente == true){
                setIsLoggedIn(true);
                setAuthUser(userData.email)
                console.log({isLoggedIn});
                navigate('./home')
            }
               
        } else
            console.log("User data not found");
        
    }

    const handleSignup = () => {

        navigate('/signup')
      
    }
    

    //RENDER
    return(
        <div className = "SignInCard">

            <h1 className="Login">LOGIN</h1>
            <div className="inputs">
                <input type = "email" placeholder="email" onChange = {(e) => setEmail(e.target.value)} />
                <input type = "password" placeholder="password" onChange = {(e) => setPassword(e.target.value)}/> 
                

            </div>
            <div className="buttons">
                <button onClick = {handleSubmit}>Sign In</button>
                <button onClick = {handleSignup}>Sign Up</button>
            </div>
        </div>
    )
    

}


export default SignIn