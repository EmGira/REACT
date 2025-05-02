import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import "../User.css"
import { FirebaseService } from '../../../services/FirebaseService';


function Registro() {

  const [farmaci, setFarmaci] = useState<any[]>([]);
  const [pazienti, setUsers] = useState<any[]>([]);
  const [piani, setPiani] = useState<any[]>([]);


  const date = () => new Date().toLocaleDateString('it-IT');

  const [editMode, setEditMode] = useState(false);

  const handleModifica = () => {
    setEditMode(true);
  };

  const handleAnnulla = () => {
    setEditMode(false);
  };

  const handleInvia = () => {
    console.log("Invio dati...");
    setEditMode(false);
  };

  // flags
  const isAdmin = true;
  const [selectedButton, setSelectedButton] = useState((isAdmin ? 1 : 2));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  const fetchFarmaci = async () => {
    try {
      const result = await FirebaseService.getFarmaci();
      setFarmaci(result); // Assegna direttamente i valori agli array
    } catch (err) {
      setError("Errore nel recupero dei farmaci");
    }
  };

  const fetchUsers = async () => {
    try {
      const result = await FirebaseService.getAllUsers();
      setUsers(result); // Assegna direttamente i valori agli array
    } catch (err) {
      setError("Errore nel recupero degli utenti");
    }
  };

  const fetchPiani = async () => {
    try{
      const result = await FirebaseService.getPiani();
      setPiani(result);
    }catch(err){
      setError("Errore nel recupero dei piani");
    }
  }

  useEffect(() => {
    // Esegui entrambe le chiamate di fetch
    fetchUsers();
    fetchFarmaci();
  }, []);

  useEffect(() => {
    if (farmaci.length > 0 && pazienti.length > 0 ) {
      setLoading(false);
    }
  }, [farmaci, pazienti]);

  if (loading) return <p>Caricamento...</p>;
  if (error) return <p>{error}</p>;



  return (
    <div className="anagrafica">

      <h2>Registro farmaci</h2>
      <hr className="linea_h2" />
      {!editMode && (
        <button onClick={handleModifica} className="button_modifica">Modifica</button>
      )}
      <div className="profilo_user">

        {piani.map((i) => (
          <li key={i}>{i.data_fine}, {i.data_inizio}, {i.id_paziente}</li>
        ))}


        <p>{date()}</p>
        <input type="checkbox" />


      </div>
      {editMode && (
        <div className="tasti_modifica">
          <button onClick={handleAnnulla}>Annulla</button>
          <button onClick={handleInvia}>Invia</button>
        </div>
      )}

    </div>



  )

}

export default Registro;