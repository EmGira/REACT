
import { useState } from "react";
import FirebaseService from "../../services/FirebaseService"


function SignUp(){

    //HOOKS
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
   

    //FUNCTIONS

 

    const handleSignup = () => {
        FirebaseService.signUp(email, password);
    }
    

    //RENDER
    return(
        <div>

            <h1>LOGIN</h1>
        
            <input type = "email" placeholder="email" onChange = {(e) => setEmail(e.target.value)} />
            <input type = "password" placeholder="password" onChange = {(e) => setPassword(e.target.value)}/> 
            <button onClick = {handleSignup}>Submit</button>

        </div>
    )
    

}


export default SignUp