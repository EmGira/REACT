import { useEffect, useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import "../User.css"
import { FirebaseService } from '../../../services/FirebaseService';
import { Farmaco } from "@/models/farmaco.model";
import { Piano } from "@/models/piano.model";
import { User } from "firebase/auth";
import { Assunzione } from "@/models/assunzione.model";
import './Registro.css'


function Registro() {

  const periodi = [
    "Prima di colazione",
    "Dopo colazione",
    "Prima di pranzo",
    "Dopo pranzo",
    "Prima di cena",
    "Dopo cena",
    "Prima di dormire"
  ];

  const { slug } = useParams();
  const navigate = useNavigate();

  const [farmaci, setFarmaci] = useState<Farmaco[]>([]);
  const [piani, setPiani] = useState<Piano[]>([]);
  const [assunzioni, setAssunzioni] = useState<Assunzione[]>([]);
  const [date, setDate] = useState<string[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    FirebaseService.getFarmaci().then((response: any) => {
      setFarmaci(response);
    });
  },[]);

  useEffect(() => {
    if(!slug){
      navigate('/');
      return;
    }
    FirebaseService.getPianiByIdPaziente(slug.split('-')[0]).then((responsePiani: any) => {

      setPiani(responsePiani);
      
      const assunzioniTemp: Assunzione[] = [];
      const uniqueDates: string[] = []; // Array per le date uniche

      if (responsePiani && responsePiani.length > 0) {
        for(let piano of responsePiani){
          for(let farmaco of piano.farmaci){
            for(let a of farmaco.assunzioni){
              const assunzioneTemp: Assunzione = {
                id_piano: piano.id,
                id_farmaco: farmaco.id_farmaco,
                data:a.data,
                periodo:farmaco.periodo,
                stato:a.stato
              }
              assunzioniTemp.push(assunzioneTemp);
              if (!uniqueDates.includes(a.data)) {
                uniqueDates.push(a.data);
              }
            }
          }
        }
      }

      assunzioniTemp.sort((a, b) => {
        const dateA = new Date(a.data);
        const dateB = new Date(b.data);

        if (dateB.getTime() !== dateA.getTime()) {
          return dateB.getTime() - dateA.getTime();
        }
    
        const indexA = periodi.indexOf(a.periodo);
        const indexB = periodi.indexOf(b.periodo);
        return indexA - indexB;
      });

      console.log(assunzioniTemp);

      setAssunzioni(assunzioniTemp);
      setDate(uniqueDates);

      setLoading(false);
    });
  },[slug, navigate]);

  const updateAssunzione = (a: Assunzione) => {
    FirebaseService.updateAssunzione(a).then((response: any) => {
      console.log(response);
      const assunzioniTemp = [...assunzioni];
      
      const updatedAssunzioni = assunzioniTemp.map((assunzione) => {

        if (assunzione.id_farmaco == a.id_farmaco && assunzione.data == a.data && assunzione.periodo == a.periodo && assunzione.id_piano == a.id_piano) {
          return { ...assunzione, stato: a.stato }; 
         
        }
        return assunzione;
      });

      setAssunzioni(updatedAssunzioni);
    });
  }

  if (loading) return (<div>Caricamento...</div>);

  return (

    <div className="main-container">
      <div className="content-right">
        {assunzioni.length != 0 && date.map((data) => (
          <div key={data} className="data-card">
            <h3>{data}</h3>
            {assunzioni
              .filter((assunzione) => assunzione.data === data)
              .map((assunzione,index) => (
                <div key={index} className="assunzione-item">
                  <p><strong>Farmaco:</strong> {assunzione.id_farmaco}</p>
                  <p><strong>Periodo:</strong> {assunzione.periodo}</p>
                  <p><strong>Stato:</strong> {assunzione.stato}</p>
                  {assunzione.stato == 'pianificato' && <div className="assunzione-buttons">
                    <button onClick={() => updateAssunzione({ ...assunzione, stato: 'assunto' })} className="btn-confirm">
                      Conferma
                    </button>
                    <button onClick={() => updateAssunzione({ ...assunzione, stato: 'dimenticato' })} className="btn-delete">
                      Dimenticato
                    </button>
                    
                  </div>}
                </div>
              ))}
          </div>
        ))}
        {assunzioni.length == 0 && (
          <div>Nessun piano attivo</div>
        )}
      </div>
    </div>

  )

}

export default Registro;