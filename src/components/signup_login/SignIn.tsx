
import { useState } from "react";
import FirebaseService from "../../services/FirebaseService"
import { Link, useNavigate } from "react-router-dom";
import './SignIn.css'

function SignIn(){

    //HOOKS
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    //FUNCTIONS

    
    const handleSubmit = () => {
        FirebaseService.signIn(email, password);
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
                <button onClick = {handleSubmit}>SignIn</button>
                <button onClick = {handleSignup}>SIGNUP</button>
            </div>
        </div>
    )
    

}


export default SignIn