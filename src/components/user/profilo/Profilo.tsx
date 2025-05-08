import { useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import FirebaseService from "../../../services/FirebaseService"
import "../User.css"
import "./Profilo.css"
import { Utente } from "../../../models/Utente.model"

function Profilo() {
  const navigate = useNavigate();

  const { slug } = useParams();  //recupero id


  const [user, setUser] = useState<any>(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState(user);
  const [loading, setLoading] = useState(true);

  const orderedKeys = [
    'nome',
    'cognome',
    'birthDate',
    'sesso',
    'codiceFiscale',
    'telefono',
    'email',
    'indirizzo',
    'comune',
    'provincia',
    'nazione',
  ];

  const labelMapping: { [key: string]: string } = {
    nome: "Nome",
    cognome: "Cognome",
    birthDate: "Data di Nascita",
    sesso: "Genere",
    codiceFiscale: "Codice Fiscale",
    telefono: "Telefono",
    email: "Email",
    indirizzo: "Indirizzo",
    comune: "Comune",
    provincia: "Provincia",
    nazione: "Nazione",
  };

  const fieldTypes: { [key: string]: string } = {
    nome: 'text',
    cognome: 'text',
    birthDate: 'date',  // Tipo data
    sesso: 'text',  // Se "sesso" è un campo che può contenere solo 'm' o 'f'
    codiceFiscale: 'text',
    telefono: 'number',
    email: 'email',  // Tipo email
    indirizzo: 'text',
    comune: 'text',
    provincia: 'text',
    nazione: 'text',
  };


  useEffect(() => {
    const fetchUserData = async () => {
      if (slug) {
        try {
          // Ottieni i dati dell'utente usando lo slug (che è l'ID)
          const userId = slug.split('-')[0];
          
          const userData = await FirebaseService.getUserData(userId);
          setUser(userData);
          setFormData(userData);  
          setLoading(false);
        } catch (error) {
          console.error("Errore nel recupero dei dati dell'utente", error);
        }
      }
    };

    fetchUserData();
  }, [slug]);


  const handleModifica = () => {
    setEditMode(true);
  };

  const handleAnnulla = () => {
    setEditMode(false);
    setFormData(user);  // resetto i dati con quelli attuali salvati
  };

  const handleInvia = async () => {
    console.log("Nome:", formData.nome);
    console.log("Email:", formData.email);
    console.log("Sesso:", formData.sesso);
    console.log("Sesso:", formData.email);
    console.log("Sesso:", formData.birthDate);
    console.log("Sesso:", formData.telefono);

    for (const [key, value] of Object.entries(formData)) {
      if (value === '' || value === null || value === undefined) {
        alert(`Il campo "${key}" è obbligatorio.`);
        return;
      }
    }
    const isValidSex = (sesso: string) =>
      /^[mf]$/i.test(sesso);  // accetta solo 'm' o 'f' (case insensitive)
    if (!isValidSex(formData.sesso)) {
      alert("Il campo Genere può essere solo 'm' o 'f'");
      return;
    }

    const isValidEmail = (email: string) =>
      /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email);

    if (!isValidEmail(formData.email)) {
      alert("L'email inserita non è valida.");
      return;
    }

    try {
      await FirebaseService.updateUserData(user.uid, formData);
      alert("Dati aggiornati con successo.");
      setUser({ ...user, ...formData });
      setEditMode(false);
    } catch (error) {
      console.error(error);
      alert("Errore durante l'aggiornamento dei dati.");
    }
  };

  if (loading) {
    return <div>Caricamento...</div>;
  }

  if (!user) {
    return <div>Nessun utente trovato.</div>;
  }

  return (
    <div className="anagrafica">

      <div className="testo_e_button">
        <h2 className="h2_user">Informazioni personali</h2>

        {!editMode && (
          <button onClick={handleModifica} className="button_modifica">Modifica</button>
        )}
      </div>

      <div className="sezione_dati">
        {orderedKeys.map((key) => (
          user[key] !== undefined &&
          <div key={key} className="input-box">

            <label className="label_anagrafica">{labelMapping[key] || key}</label>

            <input
             type={fieldTypes[key] || 'text'} 
              value={String(formData[key] || '')}  // Usa i dati nel formData
              readOnly={!editMode}
              className="input_anagrafica"
              onChange={(e) => {
                if (editMode) {
                  setFormData({
                    ...formData,
                    [key]: e.target.value,
                  });
                }
              }}
            />

          </div>
        ))}
      </div>

      {editMode && (
        <div className="tasti_modifica">
          <button className="annulla" onClick={handleAnnulla}>Annulla</button>
          <button className="invia" onClick={handleInvia}>Invia</button>
        </div>
      )}
    </div>
  )
}

export default Profilo;
