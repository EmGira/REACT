
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
        <div className="body_signUp">
            <div className="card_container_Up">
                
                <img src="/src/assets/logo_pharmaCare.svg" alt="logoLogin" className='logoLogin' />
                <b><h1 className="testo">Registrati!</h1></b>

                <hr/>
                <p className="p_signUp">Dati anagrafici</p>
                <div className="Anagrafica">
                    <div>
                    <label htmlFor="nome">Nome</label>
                    <input
                        id="nome"
                        type="text"
                        name="nome"
                        onChange={handleChange}
                        value={data.nome}
                    />
                    </div>

                    <div>
                    <label htmlFor="cognome">Cognome</label>
                    <input
                        id="cognome"
                        type="text"
                        name="cognome"
                        onChange={handleChange}
                        value={data.cognome}
                    />
                    </div>

                    <div>
                    <label htmlFor="birthdate">Data di nascita</label>
                    <input
                        id="birthdare"
                        className="birthdate"
                        type="date"
                        name="birthDate"
                        onChange={handleChange}
                        value={data.birthDate}
                    />
                    </div>

                    <div>
                    <label htmlFor="sesso">Sesso</label>
                    <select
                        id="sesso"
                        name="sesso"
                        onChange={handleChange}
                        value={data.sesso}
                    >
                        <option value="" disabled>Scegli un opzione</option>
                        <option value="male">Maschio</option>
                        <option value="female">Femmina</option>
                    </select>
                    </div>

                    <div>
                    <label htmlFor="codFiscale">Codice Fiscale</label>
                    <input
                        id="codFiscale"
                        type="text"
                        name="codiceFiscale"
                        onChange={handleChange}
                        value={data.codiceFiscale}
                    />
                    </div>

                    <div>
                    <label htmlFor="tel">Telefono</label>
                    <input
                        id="tel"
                        type="tel"
                        name="telefono"
                    /*onChange = 
                    value=*/
                    />
                    </div>

                    <div>
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        onChange={handleChange}
                        value={data.email}
                    />
                    </div>

                    <div>
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        name="password"
                        onChange={handleChange}
                        value={data.password}
                    />
                    </div>
                </div>

                <p className="p_signUp">Dati di residenza</p>

                <div className="Anagrafica">
                    <div>
                    <label htmlFor="nazione">Nazione</label>
                    <input
                        id="nazione"
                        type="text"
                        name="Nazione"
                    /*onChange = 
                    value=*/
                    />
                    </div>

                    <div>
                    <label htmlFor="provincia">Provincia</label>
                    <input
                        id="provincia"
                        type="text"
                        name="provincia"
                    /*onChange = 
                    value=*/
                    />
                    </div>

                    <div>
                    <label htmlFor="comune">Comune</label>
                    <input
                        id="comune"
                        type="text"
                        name="comune"
                        onChange={handleChange}
                        value={data.comune}
                    />
                    </div>

                    <div>
                    <label htmlFor="indirizzo">Indirizzo</label>
                    <input
                        id="indirizzo"
                        type="text"
                        name="indirizzo"
                    /*onChange = 
                    value=*/
                    />
                    </div>

                </div>


                <Button className="button_input" onClick={handleSignup}>Registrati</Button>
            </div>
        </div>
    )


}


export default SignUp