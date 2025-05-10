import './CreaPazienti.css'
import { FirebaseService } from '../../services/FirebaseService';
import { useEffect, useState } from 'react';

function CreaPazienti(){
    const [isFormValid, setIsFormValid] = useState(false);

    const [paziente, setPaziente] = useState({
        nome: "",
        cognome: "",
        birthDate: "",    // timestamp
        sesso: "",
        codiceFiscale: "",
        telefono: "",
        email: "",
        indirizzo: "",
        comune: "",
        provincia: "",
        nazione:"",
        paziente: true,
        password: ""
    });

    useEffect(() => {
        const { nome, cognome, email, sesso, comune, codiceFiscale, birthDate, password } = paziente;
    
        const isValid: boolean =
            nome.trim() !== '' &&
            cognome.trim() !== '' &&
            email.trim() !== '' &&
            sesso.trim() !== '' &&
            comune.trim() !== '' &&
            codiceFiscale.trim() !== '' &&
            birthDate !== '' &&
            password != '';
    
        setIsFormValid(isValid);
    }, [paziente]);
    

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setPaziente((prev: any) => ({
            ...prev,
            [id]: value
        }));
    };
    

    const addPaziente = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // evita il refresh della pagina
        try {
            await FirebaseService.addPaziente(paziente);
            alert("Paziente aggiunto con successo!");
            setPaziente({
                nome: "",
                cognome: "",
                birthDate: "",    // timestamp
                sesso: "",
                codiceFiscale: "",
                telefono: "",
                email: "",
                indirizzo: "",
                comune: "",
                provincia: "",
                nazione:"",
                paziente: true,
                password: ''
            });
        } catch (error) {
            console.error("Errore nell'aggiunta del paziente:", error);
        }
    };
    

    return(
        <>
            <div className="form-container-1">
                    <div className='form-card'>
                        <h1>Aggiungi un paziente</h1>
                        <form onSubmit={addPaziente}>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label htmlFor="nome">Nome</label>
                                    <input id="nome" type="text" value={paziente.nome} onChange={handleChange} required />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="cognome">Cognome</label>
                                    <input id="cognome" type="text" value={paziente.cognome} onChange={handleChange} required />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="birthDate">Data di nascita</label>
                                    <input id="birthDate" type="date" value={paziente.birthDate} onChange={handleChange} required />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="sesso">Sesso</label>
                                    <select id="sesso" value={paziente.sesso} onChange={handleChange} required>
                                        <option value="">Seleziona</option>
                                        <option value="m">Maschio</option>
                                        <option value="f">Femmina</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="codiceFiscale">Codice fiscale</label>
                                    <input id="codiceFiscale" type="text" value={paziente.codiceFiscale} onChange={handleChange} required />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="telefono">Telefono</label>
                                    <input id="telefono" type="tel" value={paziente.telefono} onChange={handleChange} required />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="email">Email</label>
                                    <input id="email" type="email" value={paziente.email} onChange={handleChange} required />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="indirizzo">Indirizzo</label>
                                    <input id="indirizzo" type="text" value={paziente.indirizzo} onChange={handleChange} required />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="comune">Comune</label>
                                    <input id="comune" type="text" value={paziente.comune} onChange={handleChange} required />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="provincia">Provincia</label>
                                    <input id="provincia" type="text" value={paziente.provincia} onChange={handleChange} required />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="nazione">Nazione</label>
                                    <input id="nazione" type="text" value={paziente.nazione} onChange={handleChange} required />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="password">Password</label>
                                    <input id="password" type="password" value={paziente.password} onChange={handleChange} required />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className={`submit-btn ${!isFormValid ? 'disabled' : ''}`}
                                disabled={!isFormValid}
                            >
                                Crea
                            </button>
                        </form>

                    </div>    
                </div>
            </>
    )
}

export default CreaPazienti;