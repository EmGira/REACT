import { use, useEffect, useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { FirebaseService } from '../../../services/FirebaseService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons';

import "../User.css"
import "./piano.css"


function Piano({ user }: any) {
  const navigate = useNavigate();

  const [pianiPaziente, setPianiPaziente] = useState<any[]>([]);

  const frequenze = [
    { value: 1, label: 'Ogni giorno' },
    { value: 2, label: 'Ogni 2 giorni' },
    { value: 3, label: 'Ogni 3 giorni' }
  ];

  const image = ["/src/assets/user/manIcon.svg", "/src/assets/user/girlIcon.svg"];

  const [currentSlug, setCurrentSlug] = useState('');
  const { slug } = useParams();
  const [farmaci, setFarmaci] = useState<any[]>([]);

  useEffect(() => {
    fetchFarmaci();
  }, []);

  const fetchFarmaci = async () => {
    try {
      const result = await FirebaseService.getFarmaci();
      setFarmaci(result); // Assegna direttamente i valori agli array
    } catch (err) {
      setError("Errore nel recupero dei farmaci");
    }
  };

  useEffect(() => {
    if (slug == null) {
      navigate('/');
      return;
    }

    setCurrentSlug(slug);
  }, [slug, navigate]);

  useEffect(() => {
    console.log(user)
    FirebaseService.getPiani().then((piani: any) => {
      const pianiFiltrati = piani.filter((piano: any) => piano.id_paziente == currentSlug.split('-')[0]);
      setPianiPaziente(pianiFiltrati);
      console.log(pianiFiltrati)
    });

  }, [currentSlug]);

  const icon = (genere: string) => {
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
    if (frequenza == 1)
      return frequenze[0].label;
    else if (frequenza == 2)
      return frequenze[1].label;
    else if (frequenza == 3)
      return frequenze[2].label;
  }

  const getFarmaco = (id: string) => {
    const farmaco = farmaci.find((farmaco: any) => farmaco.id == id) || null;
    if (farmaco != null)
      return farmaco.nome.charAt(0).toUpperCase() + farmaco.nome.slice(1);
  }

  return (
    <div className="anagrafica">

      <h2 className="h2_user">Lista dei piani</h2>

      <div className="menu_piani">
          <FontAwesomeIcon icon={faCirclePlus} className='piu_icon' />
          <div onClick={() => { navigate("/user/crea-piano/" + currentSlug) }}>Aggiungi un nuovo piano</div>
        </div>

      <div className="sezione_dati">
        <div className="piani_utente">
          {pianiPaziente.length != 0 &&
            pianiPaziente.map((piano: any) => (
              <div key={piano.id}>
                {piano.data_inizio} - {piano.data_fine}
                {
                  piano.farmaci.map((farmaco: any) => (
                    <div key={farmaco.id_farmaco}>
                      {getFarmaco(farmaco.id_farmaco)} - {farmaco.dose}mg - {getFrequenza(farmaco.frequenza)} - {farmaco.periodo}
                    </div>
                  ))
                }
              </div>
            ))
          }
        </div>
      </div>
    </div>



  )

}

export default Piano;

function setError(arg0: string) {
  throw new Error("Function not implemented.");
}
