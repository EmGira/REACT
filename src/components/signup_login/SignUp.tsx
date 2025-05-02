
import { useState } from "react";
import FirebaseService from "../../services/FirebaseService"
import './SignUp.css'
/*import { Input } from '../ui/input';*/
import { Button } from '../ui/button';
import "./login.css"

  

function SignUp(){

    const[data, setData] = useState({
        email: '',
        password: '',
        nome: '',
        cognome: '',
        sesso: 'male',
        birthDate: '',
        comune: '',
        codiceFiscale: '',
        paziente: true
        


    })
   


 

    const handleSignup = () => {
        FirebaseService.signUp(data);
        console.log("Form data:", data);  // Add a log here for debugging
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        })
   
    }
    

    //RENDER
    return(
        <div className="body_login">
        <div className = "card_container">
            
            <h1 className="SignUp">SIGN UP</h1>
        
            <div className="Anagrafica">

                <input 
                    type = "email" 
                    name = "email" 
                    placeholder="email" 
                    onChange = {handleChange} 
                    value={data.email}  
                />

                <input 
                    type = "text" 
                    name = "nome" 
                    placeholder="Nome" 
                    onChange = {handleChange} 
                    value={data.nome} 
                /> 

                <input 
                    type = "text" 
                    name = "cognome" 
                    placeholder="Cognome" 
                    onChange = {handleChange} 
                    value={data.cognome}
                /> 

                <select 
                    id="sesso" 
                    name="sesso" 
                    onChange = {handleChange} 
                    value={data.sesso}
                >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                </select> 
      
                <input 
                    className="birthdate"
                    type = "date" 
                    name = "birthDate" 
                    placeholder="Data di nascita" 
                    onChange = {handleChange} 
                    value={data.birthDate}
                /> 

                <input 
                    type = "text" 
                    name = "comune" 
                    placeholder="Comune" 
                    onChange = {handleChange} 
                    value={data.comune}
                /> 

                <input 
                    type = "text" 
                    name = "codiceFiscale" 
                    placeholder="Codice fiscale"
                    onChange = {handleChange} 
                    value={data.codiceFiscale}
                /> 

                <input 
                    type = "password" 
                    name = "password" 
                    placeholder="password" 
                    onChange = {handleChange} 
                    value={data.password}
                /> 


            </div>  

            <Button onClick = {handleSignup}>Submit</Button>
        </div>
        </div>
    )
    

}


export default SignUp