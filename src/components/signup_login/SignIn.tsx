
import { useState } from "react";
import FirebaseService from "../../services/FirebaseService"
import { Link, useNavigate } from "react-router-dom";

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
        <div>

            <h1>LOGIN</h1>
        
            <input type = "email" placeholder="email" onChange = {(e) => setEmail(e.target.value)} />
            <input type = "password" placeholder="password" onChange = {(e) => setPassword(e.target.value)}/> 
            <button onClick = {handleSubmit}>SignIn</button>
            <button onClick = {handleSignup}>SIGNUP</button>
        </div>
    )
    

}


export default SignIn