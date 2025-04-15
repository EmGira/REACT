
import { useState } from "react";
import FirebaseService from "../../services/FirebaseService"
import './SignUp.css'
import { Input } from '../ui/input';
import { Button } from '../ui/button';

  

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
        <div className = "SignUpCard">

            <h1 className="SignUp">SIGN UP</h1>
        
            <Input type = "email" name = "email" placeholder="email" onChange = {handleChange} value={data.email}  />

            <div className="Anagrafica">

                <Input 
                    type = "text" 
                    name = "nome" 
                    placeholder="Nome" 
                    onChange = {handleChange} 
                    value={data.nome} 
                /> 

                <Input 
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
      


                <Input 
                    className="birthdate"
                    type = "date" 
                    name = "birthDate" 
                    placeholder="Data di nascita" 
                    onChange = {handleChange} 
                    value={data.birthDate}
                /> 

                <Input 
                    type = "text" 
                    name = "comune" 
                    placeholder="Comune" 
                    onChange = {handleChange} 
                    value={data.comune}
                /> 

                <Input 
                    type = "text" 
                    name = "codiceFiscale" 
                    placeholder="Codice fiscale"
                    onChange = {handleChange} 
                    value={data.codiceFiscale}
                /> 

            </div>  

            <Input type = "password" name = "password" placeholder="password" onChange = {handleChange} value={data.password}/> 

            <Button onClick = {handleSignup}>Submit</Button>

        </div>
    )
    

}


export default SignUp