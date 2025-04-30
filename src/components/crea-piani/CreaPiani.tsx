import './CreaPiani.css'
import { FirebaseService } from '../../services/FirebaseService';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';


function CreaPiani(){

    const { slug } = useParams();
    const navigate = useNavigate();
    const [currentSlug, setCurrentSlug] = useState('');
    // validators
    const [isFormValid, setIsFormValid] = useState(false);
    const [isFarmacoValid, setIsFarmacoValid] = useState(false);

    // array
    const [farmaci, setFarmaci] = useState<any[]>([]);
    const [farmaciAggiunti, setFarmaciAggiunti] = useState<any[]>([]);

    // piano
    const [piano, setPiano] = useState<any>({
        farmaci: [],
        id_paziente: 'qfikoLwL8lTNitXVSbbngLccwsF3', // da cambiare 
        data_inizio: '',
        data_fine: ''
    });
    
    // farmaco aggiunto
    const [farmaco, setFarmaco] = useState({
        id_farmaco: '',
        periodo: '',
        dose: 1,
        frequenza: 0
    });
    const periodi = [
        "Prima di colazione",
        "Dopo colazione",
        "Prima di pranzo",
        "Dopo pranzo",
        "Prima di cena",
        "Dopo cena",
        "Prima di dormire",
        "Orario personalizzato"
    ];
    const frequenze = [
        { value: 1, label: 'Ogni giorno' },
        { value: 2, label: 'Ogni 2 giorni' },
        { value: 3, label: 'Ogni 3 giorni' }
    ];
        
    // on init
    useEffect(() => {
        fetchFarmaci();
        fetch
    }, []);

    useEffect(() => {
        if(slug == null){
            navigate('/');
            return;
        }

        setPiano({
            farmaci: [],
            id_paziente: slug.split('-')[0], // da cambiare 
            data_inizio: '',
            data_fine: ''
        });

        setCurrentSlug(slug);
        
    },[slug, navigate]);

    // ottengo tutti i farmaci disponibili
    const fetchFarmaci = async () => {
        try {
          const result = await FirebaseService.getFarmaci();
          setFarmaci(result); // Assegna direttamente i valori agli array
        } catch (err) {
          setError("Errore nel recupero dei farmaci");
        }
    };

    // validatore per farmaco
    useEffect(() => {
        const { id_farmaco, periodo, dose, frequenza } = farmaco;
        const isValid =
            id_farmaco.trim() !== '' &&
            periodo.trim() !== '' &&
            !isNaN(dose) && dose > 0 && // Assicurati che la dose sia un numero positivo
            !isNaN(frequenza) && frequenza > 0; // Assicurati che la frequenza sia un numero positivo
    
        setIsFarmacoValid(isValid);
    }, [farmaco]);


    useEffect(() => {
        const isValid = piano.id_paziente.trim() !== '' && farmaciAggiunti.length > 0 && piano.data_inizio.trim() !== '';

        setPiano((prevPiano: any) => ({
            ...prevPiano,
            farmaci: farmaciAggiunti
        }));
    
        if (piano.data_inizio !== '') {
            const dataInizio = new Date(piano.data_inizio);
            const dataFine = new Date(dataInizio);
            dataFine.setDate(dataInizio.getDate() + 7); 
    
            setPiano((prevPiano: any) => ({
                ...prevPiano,
                data_fine: dataFine.toISOString().split('T')[0]
            }));
        } else {
            setPiano((prevPiano: any) => ({
                ...prevPiano,
                data_fine: ''
            }));
        }
    
        setIsFormValid(isValid);
    }, [piano.data_inizio, farmaciAggiunti]);

    const addFarmacoToList = (e: any) => {
        e.preventDefault();
        const newFarmaco = { ...farmaco };
        setFarmaciAggiunti((prevFarmaci) => [...prevFarmaci, newFarmaco]);

        setFarmaco({
            id_farmaco: '',
            periodo: '',
            dose: 1,
            frequenza: 1
        });
    };

    const createPiano = async (e: any) => {
        e.preventDefault();
    
        try {
            await FirebaseService.addPiano(piano);
            alert("Farmaco aggiunto con successo!");
            setFarmaco({
                id_farmaco: '',
                periodo: '',
                dose: 1,
                frequenza: 1
            });
    
            setPiano({
                farmaci: [],
                id_paziente: currentSlug.split('-')[0],
                data_inizio: '',
                data_fine: ''
            });
        } catch (error) {
            console.error("Errore nell'aggiunta del farmaco:", error);
        }  
    };

    const getFrequenza = (frequenza: number) => {
        if(frequenza == 1)
            return frequenze[0].label;
        else if(frequenza == 2)
            return frequenze[1].label;
        else if(frequenza == 3)
            return frequenze[2].label;
    }

    const getFarmaco = (id: string) => {
        const farmaco = farmaci.find((farmaco: any) => farmaco.id == id) || null;
        if(farmaco != null)
            return farmaco.nome.charAt(0).toUpperCase() + farmaco.nome.slice(1);
    }
    
    return (
        <div className="container">
            <div className='form-separatore'>
                <div className="form-container">
                    <h2>Aggiungi un Farmaco</h2>
                    <form onSubmit={addFarmacoToList}>
                        <div className='form-dimensione'>
                            <div className="form-group">
                                <label htmlFor="id_farmaco">Seleziona Farmaco</label>
                                <select
                                    id="id_farmaco"
                                    value={farmaco.id_farmaco}
                                    onChange={(e) => setFarmaco({ ...farmaco, id_farmaco: e.target.value })}
                                    required
                                >
                                    <option value="">Seleziona un farmaco</option> {/* Opzione di default */}
                                    {farmaci.map((farmacoItem) => (
                                        <option key={farmacoItem.id} value={farmacoItem.id}>
                                            {farmacoItem.nome}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="periodo">Periodo</label>
                                <select
                                    id="periodo"
                                    value={farmaco.periodo}
                                    onChange={(e) => setFarmaco({ ...farmaco, periodo: e.target.value })}
                                    required
                                >
                                    <option value="">Seleziona un periodo</option> {/* Opzione di default */}
                                    {periodi.map((periodo, index) => (
                                        <option key={index} value={periodo}>
                                            {periodo}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="dose">Dose (mg)</label>
                                <input
                                    id="dose"
                                    type="number"
                                    value={farmaco.dose}
                                    onChange={(e) => setFarmaco({ ...farmaco, dose: parseInt(e.target.value) })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="frequenza">Frequenza</label>
                                <select
                                    id="frequenza"
                                    value={farmaco.frequenza}
                                    onChange={(e) => setFarmaco({ ...farmaco, frequenza: parseInt(e.target.value) })}
                                    required
                                >
                                    <option value="">Seleziona frequenza</option> {/* Opzione di default */}
                                    {frequenze.map((freq) => (
                                        <option key={freq.value} value={freq.value}>
                                            {freq.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <button type="submit" className={`submit-btn ${!isFarmacoValid ? 'disabled' : ''}`} disabled={!isFarmacoValid}>
                            Aggiungi Farmaco
                        </button>
                    </form>
                </div>
        
                {/* Form per creare un piano */}
                <div className="form-container">
                    <h2>Crea Piano</h2>
                    <form onSubmit={createPiano}>
                        <div className='form-dimensione'>
                            {/* <div className="form-group">
                                <label htmlFor="id_paziente">ID Paziente</label>
                                <input
                                    id="id_paziente"
                                    type="text"
                                    value={piano.id_paziente}
                                    onChange={(e) => setPiano({ ...piano, id_paziente: e.target.value })}
                                    required
                                />
                            </div> */}
                            <div className="form-group">
                                <label htmlFor="data_inizio">Data Inizio</label>
                                <input
                                    id="data_inizio"
                                    type="date"
                                    value={piano.data_inizio}
                                    onChange={(e) => setPiano({ ...piano, data_inizio: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="data_fine">Data Fine</label>
                                <input
                                    id="data_fine"
                                    type="date"
                                    value={piano.data_fine}
                                    readOnly
                                />
                            </div>
            
                            <div className="form-group, farmaci-aggiunti">
                                <label>Farmaci prescritti</label>
                                <ul>
                                    {farmaciAggiunti.length == 0 && <p>Nessun farmaco aggiunto...</p>}
                                    {farmaciAggiunti.map((farmaco, index) => (
                                        <li key={index}>
                                            {getFarmaco(farmaco.id_farmaco)} - {farmaco.dose}mg - {getFrequenza(farmaco.frequenza)} - {farmaco.periodo}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
        
                        <button type="submit" className={`submit-btn ${!isFormValid ? 'disabled' : ''}`} disabled={!isFormValid}>
                            Crea Piano
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default CreaPiani

function setError(arg0: string) {
    throw new Error('Function not implemented.');
}
