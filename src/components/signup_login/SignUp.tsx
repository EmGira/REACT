
import { useState } from "react";
import FirebaseService from "../../services/FirebaseService"
/*import { Input } from '../ui/input';*/
import { Button } from '../ui/button';
import "./login.css"
import './SignUp.css'



function SignUp() {

    const [data, setData] = useState({
        email: '',
        password: '',
        nome: '',
        cognome: '',
        sesso: '',
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
    return (
        <div className="body_login">
            <div className="card_container_Up">
                
                <img src="/src/assets/logo_pharmaCare.svg" alt="logoLogin" className='logoLogin' />
                <b><h1 className="testo">Registrati!</h1></b>

                <p className="p_signUp">Dati anagrafici</p>
                <div className="Anagrafica">
                    <input
                        type="text"
                        name="nome"
                        placeholder="Nome"
                        onChange={handleChange}
                        value={data.nome}
                    />

                    <input
                        type="text"
                        name="cognome"
                        placeholder="Cognome"
                        onChange={handleChange}
                        value={data.cognome}
                    />

                    <input
                        className="birthdate"
                        type="date"
                        name="birthDate"
                        placeholder="Data di nascita"
                        onChange={handleChange}
                        value={data.birthDate}
                    />

                    <select
                        id="sesso"
                        name="sesso"
                        onChange={handleChange}
                        value={data.sesso}
                    >
                        <option value="" disabled>Sesso</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>

                    <input
                        type="text"
                        name="codiceFiscale"
                        placeholder="Codice fiscale"
                        onChange={handleChange}
                        value={data.codiceFiscale}
                    />

                    <input
                        type="tel"
                        name="telefono"
                        placeholder="Telefono"
                    /*onChange = 
                    value=*/
                    />

                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        onChange={handleChange}
                        value={data.email}
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        onChange={handleChange}
                        value={data.password}
                    />
                </div>

                <p className="p_signUp">Dati di residenza</p>

                <div className="Anagrafica">
                    <input
                        type="text"
                        name="Nazione"
                        placeholder="Nazione"
                    /*onChange = 
                    value=*/
                    />

                    <input
                        type="text"
                        name="provincia"
                        placeholder="Provincia"
                    /*onChange = 
                    value=*/
                    />

                    <input
                        type="text"
                        name="comune"
                        placeholder="Comune"
                        onChange={handleChange}
                        value={data.comune}
                    />

                    <input
                        type="text"
                        name="indirizzo"
                        placeholder="Indirizzo"
                    /*onChange = 
                    value=*/
                    />

                </div>


                <Button className="button_input" onClick={handleSignup}>Registrati</Button>
            </div>
        </div>
    )


}


export default SignUp