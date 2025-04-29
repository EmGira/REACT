import './CreaFarmaci.css'
import { FirebaseService } from '../../services/FirebaseService';
import { useEffect, useState } from 'react';

function CreaFarmaci(){

    const [isFormValid, setIsFormValid] = useState(false);

    const [farmaco, setFarmaco] = useState({
        nome: "",
        descrizione: "",
        quantità: 1,
        scadenza: "",
        srcImg: ""
    });

    useEffect(() => {
        const { nome, descrizione, quantità, scadenza, srcImg } = farmaco;
        const isValid: boolean =
            nome.trim() != '' &&
            descrizione.trim() != '' &&
            srcImg.trim() != '' &&
            scadenza != '' &&
            quantità > 0;
    
        setIsFormValid(isValid);
    }, [farmaco]);

    const handleChange = (e: any) => {
        const { id, value } = e.target;
        setFarmaco((prev: any) => ({
            ...prev,
            [id]: id === "quantità" ? parseInt(value) : value
        }));
    };

    const addFarmaco = async (e: any) => {
        e.preventDefault(); // evita il refresh della pagina
        try {
            await FirebaseService.addFarmaco(farmaco);
            alert("Farmaco aggiunto con successo!");
            setFarmaco({
                nome: "",
                descrizione: "",
                quantità: 1,
                scadenza: "",
                srcImg: ""
            });
        } catch (error) {
            console.error("Errore nell'aggiunta del farmaco:", error);
        }
    };

    return(
        <>
            <div className="container">
                <div className='form-container'>
                    <div className='form-card'>
                        <h1>Aggiungi un farmaco</h1>
                        <form onSubmit={addFarmaco}>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label htmlFor="nome">Nome</label>
                                    <input id="nome" type="text" value={farmaco.nome} onChange={handleChange} required/>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="quantità">Quantità</label>
                                    <input id="quantità" type="number" value={farmaco.quantità} onChange={handleChange} required/>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="scadenza">Scadenza</label>
                                    <input id="scadenza" type="date" value={farmaco.scadenza} onChange={handleChange} required/>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="srcImg">Immagine (URL)</label>
                                    <input id="srcImg" type="text" value={farmaco.srcImg} onChange={handleChange} required/>
                                </div>
                            </div>

                            <div className="form-group full-width">
                                <label htmlFor="descrizione">Descrizione</label>
                                <textarea id="descrizione" rows={4} value={farmaco.descrizione} onChange={handleChange} required></textarea>
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
            </div>
            
        </>
    )
}

export default CreaFarmaci;