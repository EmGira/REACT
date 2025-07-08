import { use, useEffect, useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { FirebaseService } from '../../../services/FirebaseService';
import "./piano.css"
import { useAuth } from "@/components/contexts/AuthContext";


function Piano({user}: any) {
  const navigate = useNavigate();

   
      const {
              isMedic
      } = useAuth();

  const [pianiPaziente, setPianiPaziente] = useState<any[]>([]);
  const [isMedicUpdate, setIsMedicUpdate] = useState(false);

  const frequenze = [
    { value: 1, label: 'Ogni giorno' },
    { value: 2, label: 'Ogni 2 giorni' },
    { value: 3, label: 'Ogni 3 giorni' }
  ];

  const image = ["/src/assets/user/manIcon.svg", "/src/assets/user/girlIcon.svg"];

  const [currentSlug, setCurrentSlug] = useState('');
  const { slug } = useParams();
  const [farmaci, setFarmaci] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFarmaci();
    console.log("ISMEDIC VALUE", isMedic);


  },[]);


  const fetchFarmaci = async () => {
      try {
        const result = await FirebaseService.getFarmaci();
        setFarmaci(result); // Assegna direttamente i valori agli array
      } catch (err) {
        setError("Errore nel recupero dei farmaci");
      }
  };

  useEffect(() => {
    if(slug == null){
      navigate('/');
      return;
    }

    setCurrentSlug(slug);
  },[slug, navigate]);

  useEffect(() => {
    FirebaseService.getPiani().then((piani: any) => {
      const pianiFiltrati = piani.filter((piano: any) => piano.id_paziente == currentSlug.split('-')[0]);
      setPianiPaziente(pianiFiltrati);
      setLoading(false);
    });
    
  },[currentSlug]);

  const icon = (genere : string) => {
      return user.genere === "M" ? image[0] : image[1];
  }   

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

  if (loading) return (<div>Caricamento...</div>);

  return(
    <div className="anagrafica">

      <h1>Lista dei piani</h1>

      {pianiPaziente.length != 0 && 
        pianiPaziente.map((piano: any) => (
          <div key={piano.id}  className="piano-card" onClick={() => navigate('./' + piano.id)}>
                  <div className="piano-date">
                     {piano.data_inizio} – {piano.data_fine}
                  </div>
            {
              piano.farmaci.map((farmaco: any) => (
                <div key={farmaco.id_farmaco} className="farmaco-item">
                  {getFarmaco(farmaco.id_farmaco)} - {farmaco.dose}mg - {getFrequenza(farmaco.frequenza)} - {farmaco.periodo}
                </div>
              ))
            }
          </div>
        ))  
      }
      <br />
      {isMedic && <div className = "aggiungi-piano" onClick={() => {navigate("/user/crea-piano/"+currentSlug)}}>Aggiungi un nuovo piano</div>}

        {/* <h2>Informazioni personali</h2>
        <hr className="linea_h2"/>
        {!editMode && (
            <button onClick={handleModifica} className="button_modifica">Modifica</button>
        )}
        <div className="profilo_user">
            {Object.entries(user).map(([key, value]) => (
            <div key={key} className="input-box">
                <label className="label_anagrafica">{key}</label>
                <input type="text" value={value} readOnly className="input_anagrafica"/>
            </div>
            ))}
        </div>
        {editMode && (
        <div className="tasti_modifica">
          <button  onClick={handleAnnulla}>Annulla</button>
          <button onClick={handleInvia}>Invia</button>
        </div>
        )} */}

    </div>



  )

}

export default Piano;

function setError(arg0: string) {
  throw new Error("Function not implemented.");
}
