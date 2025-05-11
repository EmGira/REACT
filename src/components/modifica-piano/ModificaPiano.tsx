import { useNavigate, useParams } from 'react-router-dom';
import './ModificaPiano.css'
import { useEffect, useState } from 'react';
import FirebaseService from '@/services/FirebaseService';
import { Piano } from '@/models/piano.model';
import { Farmaco } from '@/models/farmaco.model';
import { RiferimentoFarmaco } from '@/models/riferimentoFarmaco.model';

function ModificaPiano(){

    const { slug, idPiano } = useParams();
    const navigate = useNavigate();

    const [currentUserId, setCurrentUserId] = useState('');
    const [currentePianoId, setCurrentePianoId] = useState('');

    const [piani, setPiani] = useState<Piano[]>([]);
    const [pianoPaziente, setPianoPaziente] = useState<Piano | null>(null);

    const [isAddingFarmaco, setIsAddingFarmaco] = useState(false);
    const [newFarmaco, setNewFarmaco] = useState<RiferimentoFarmaco>({
        id_farmaco: '',
        dose: 0,
        frequenza: 1,
        periodo: '',
        assunzioni: []
    });

    const [farmaci, setFarmaci] = useState<Farmaco[]>([]);
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
    
    const [isEditing, setIsEditing] = useState(false);

    const [isValid, setIsValid] = useState(false);

    useEffect(() => {
            FirebaseService.getPiani().then((response: any) => {    
                setPiani(response);
            });
            FirebaseService.getFarmaci().then((response: any) => {    
                setFarmaci(response);
            });
    },[]);

    useEffect(() => {
        if(slug == null || idPiano == null){
            navigate('/');
            return;
        }
        setPianoPaziente(piani.find((piano: Piano) => piano.id == idPiano) || null);
        setCurrentUserId(slug.split('-')[0]);
        setCurrentePianoId(idPiano);
        
    },[slug, idPiano, navigate, piani, isEditing]);

    useEffect(() => {
      handleValidation();
    }, [pianoPaziente]);

    const toggleEdit = () => {
        setIsEditing(!isEditing);
        setIsAddingFarmaco(false);
    }

    const handleFarmacoChange = (index: number, field: string, value: any) => {
        if (!pianoPaziente) return;
    
        const updatedFarmaci: RiferimentoFarmaco[] = [...pianoPaziente.farmaci];
        if(field == 'frequenza'){

          updatedFarmaci[index].assunzioni = [];

          const data = new Date(pianoPaziente.data_inizio);

          for (let i = 0; i < 7; i += value) {
            const nuovaData = new Date(data);
            nuovaData.setDate(nuovaData.getDate() + i);
            if (!isNaN(nuovaData.getTime())) {
              updatedFarmaci[index].assunzioni.push({
                    data: nuovaData.toISOString().split('T')[0],
                    stato: 'pianificato'
                });
            } else {
            console.error("Data non valida: ", nuovaData);
            }
          }
        }

        updatedFarmaci[index] = {
            ...updatedFarmaci[index],
            [field]: value,
        };
    
        setPianoPaziente({
            ...pianoPaziente,
            farmaci: updatedFarmaci,
        });
    };
    
    const handleAddFarmaco = () => {
        if (!pianoPaziente || !newFarmaco.id_farmaco) return;

        const updatedFarmaci: RiferimentoFarmaco[] = [...pianoPaziente.farmaci];

        const newFarmacoCompleto: RiferimentoFarmaco = {...newFarmaco};

        const data = new Date(pianoPaziente.data_inizio);

        for (let i = 0; i < 7; i += newFarmacoCompleto.frequenza) {
          const nuovaData = new Date(data);
          nuovaData.setDate(nuovaData.getDate() + i);
          if (!isNaN(nuovaData.getTime())) {
            newFarmacoCompleto.assunzioni.push({
              data: nuovaData.toISOString().split('T')[0],
              stato: 'pianificato'
            });
          } else {
          console.error("Data non valida: ", nuovaData);
          }
        }

        updatedFarmaci.push(newFarmacoCompleto);

        setPianoPaziente({
            ...pianoPaziente,
            farmaci: updatedFarmaci,
        });

        // Resetta il form e chiudi il modal
        setNewFarmaco({
          id_farmaco: '',
          dose: 0,
          frequenza: 1,
          periodo: '',
          assunzioni: []
        });
        setIsAddingFarmaco(false);
    };

    const handleRemoveFarmaco = (index: number) => {
        if (!pianoPaziente) return;

        const updatedFarmaci: RiferimentoFarmaco[] = [...pianoPaziente.farmaci];

        updatedFarmaci.splice(index, 1);

        setPianoPaziente({
            ...pianoPaziente,
            farmaci: updatedFarmaci,
        });
    };

    const handleChangeNewFarmaco = (field: string, value: any) => {
        setNewFarmaco({
            ...newFarmaco,
            [field]: value,
        });
    };

    const handleValidation = () => {
      if (!pianoPaziente || pianoPaziente.farmaci == null || pianoPaziente.farmaci.length <= 0) {
        setIsValid(false);
        return;
      }
    
      for (let p of pianoPaziente.farmaci) {
        if (p.dose <= 0 || ![1, 2, 3].includes(p.frequenza) || p.periodo === 'Seleziona un periodo') {
          setIsValid(false);
          return;
        }
      }
    
      setIsValid(true);
    }
    
    const handleDataInizio = (d: string) => {

      if (pianoPaziente == null) return;

      const farmaciAggiornato = [];

      for (let farmaco of pianoPaziente.farmaci) {
          const data = new Date(d);
          const farmacoCopia = { ...farmaco};
          farmacoCopia.assunzioni = [];

          for (let i = 0; i < 7; i += farmacoCopia.frequenza) {
              const nuovaData = new Date(data);
              nuovaData.setDate(nuovaData.getDate() + i);
              if (!isNaN(nuovaData.getTime())) {
                  farmacoCopia.assunzioni.push({
                      data: nuovaData.toISOString().split('T')[0],
                      stato: 'pianificato'
                  });
              } else {
              console.error("Data non valida: ", nuovaData);
              }
          }

          farmaciAggiornato.push(farmacoCopia);
      }

      console.log(farmaciAggiornato);

      const date = new Date(d);
      date.setDate(date.getDate() + 7);
    
      const newDate = date.toISOString().split('T')[0];

      setPianoPaziente({
        id: pianoPaziente.id,
        farmaci: farmaciAggiornato,
        id_paziente: pianoPaziente.id_paziente,
        data_inizio: d,
        data_fine: newDate
      });
    }
    

    return ( 
        <div className="p-6 max-w-3xl mx-auto  rounded-2xl ">
          {pianoPaziente == null ? (
            // Se pianoPaziente è null, mostra il messaggio di errore
            <div>
              <h2 className="text-xl font-semibold text-red-600">Errore!</h2>
              <p className="text-red-500">
                Si è verificato un problema nel recuperare il piano. Riprova più tardi.
              </p>
            </div>
          ) : (
            <>
              {/* Modalità visualizzazione e modifica del piano */}
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Gestione Piano</h2>
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                  onClick={toggleEdit}
                >
                  {isEditing ? "Annulla" : "Modifica"}
                </button>
              </div>
    
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm text-gray-600">ID Paziente</label>
                  <input
                    type="text"
                    className="w-full border rounded p-2 bg-gray-100"
                    value={pianoPaziente?.id_paziente || ""}
                    disabled
                  />
                </div>
                <div></div>
                <div>
                  <label className="block text-sm text-gray-600">Data Inizio</label>
                  <input
                    type="date"
                    className="w-full border rounded p-2 bg-gray-100"
                    value={pianoPaziente?.data_inizio || ""}
                    disabled={!isEditing}
                    onChange={(e) => handleDataInizio(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600">Data Fine</label>
                  <input
                    type="date"
                    className="w-full border rounded p-2 bg-gray-100"
                    value={pianoPaziente?.data_fine || ""}
                    disabled
                  />
                </div>
              </div>
    
              <div className="mb-4">
                <h3 className="text-lg font-medium mb-2">Farmaci</h3>
    
                <div className="space-y-4">
                  {pianoPaziente.farmaci.map((farmaco, index) => (
                    <div className="grid grid-cols-5 gap-2 items-center" key={index}>
                      <input
                        type="text"
                        className="border rounded p-2"
                        placeholder="ID Farmaco"
                        value={farmaci.find((f: Farmaco) => f.id == farmaco.id_farmaco)?.nome}
                        // onChange={(e) =>
                        //   handleFarmacoChange(index, "id_farmaco", e.target.value)
                        // }
                        disabled={true}
                      />
                        <select
                            className="border rounded p-2"
                            value={farmaco.periodo}
                            onChange={(e) => handleFarmacoChange(index, "periodo", e.target.value)}
                            disabled={!isEditing}
                        >
                            <option value="">Seleziona un periodo</option>
                            {periodi.map((periodo, index) => (
                                <option key={index} value={periodo}>{periodo}</option>
                            ))}
                        </select>
                      <select
                        className="border rounded p-2"
                        value={farmaco.frequenza}
                        onChange={(e) =>
                          handleFarmacoChange(index, "frequenza", parseInt(e.target.value))
                        }
                        disabled={!isEditing}
                      >
                        <option value={frequenze[0].value}>{frequenze[0].label}</option>
                        <option value={frequenze[1].value}>{frequenze[1].label}</option>
                        <option value={frequenze[2].value}>{frequenze[2].label}</option>
                      </select>
                      <input
                        type="number"
                        className="border rounded p-2"
                        placeholder="Dose"
                        value={farmaco.dose}
                        onChange={(e) =>
                          handleFarmacoChange(index, "dose", parseFloat(e.target.value))
                        }
                        disabled={!isEditing}
                      />
                      <button
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleRemoveFarmaco(index)}
                        disabled={!isEditing}
                      >
                        🗑
                      </button>
                    </div>
                  ))}
                </div>
    
                {isEditing && (
                  <button
                    className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
                    onClick={() => setIsAddingFarmaco(true)}
                >
                    + Aggiungi Farmaco
              </button>
                )}
            </div>

            {isAddingFarmaco && (
                    <div className="modal">
                        <h3 className="text-xl font-medium mb-4">Aggiungi Nuovo Farmaco</h3>
                        <select
                            className="border rounded p-2 mb-4"
                            value={newFarmaco.id_farmaco}
                            onChange={(e) => handleChangeNewFarmaco('id_farmaco', e.target.value)}
                        >
                            <option value="">Seleziona un farmaco</option>
                            {farmaci.map((farmaco, index) => (
                                <option key={index} value={farmaco.id}>{farmaco.nome}</option>
                            ))}
                        </select>

                        <select
                            className="border rounded p-2 mb-4"
                            value={newFarmaco.periodo}
                            onChange={(e) => handleChangeNewFarmaco('periodo', e.target.value)}
                        >
                            <option value="">Seleziona un periodo</option>
                            {periodi.map((periodo, index) => (
                                <option key={index} value={periodo}>{periodo}</option>
                            ))}
                        </select>
                        <select
                            className="border rounded p-2 mb-4"
                            value={newFarmaco.frequenza}
                            onChange={(e) => handleChangeNewFarmaco('frequenza', parseInt(e.target.value))}
                        >
                            <option value={frequenze[0].value}>{frequenze[0].label}</option>
                            <option value={frequenze[1].value}>{frequenze[1].label}</option>
                            <option value={frequenze[2].value}>{frequenze[2].label}</option>
                        </select>

                        <input
                            type="number"
                            className="border rounded p-2 mb-4"
                            placeholder="Dose"
                            value={newFarmaco.dose}
                            onChange={(e) => handleChangeNewFarmaco('dose', parseFloat(e.target.value))}
                        />

                        <div className="text-right">
                            <button
                                className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition"
                                onClick={handleAddFarmaco}
                            >
                                Aggiungi
                            </button>
                            <button
                                className="ml-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                                onClick={() => setIsAddingFarmaco(false)}
                            >
                                Annulla
                            </button>
                        </div>
                    </div>
                )}
    
              {isEditing && (
                <div className="button-group text-right fondo">
                {isValid && (
                  <button
                    className="buttonModifica px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition mr-4"
                    onClick={() => {
                      FirebaseService.updatePiano(pianoPaziente).then((response: any) => {
                        console.log(response);
                        FirebaseService.getPiani().then((response: any) => {    
                          setPiani(response);
                          toggleEdit();
                        });
                      });
                      
                      console.log("Conferma modifiche:", farmaci);
                    }}
                  >
                    Conferma modifiche
                  </button>
                )}

                {!isValid && (
                  <button
                    className=" buttonModifica px-4 py-2 bg-gray-400 text-gray-200 cursor-not-allowed rounded transition mr-4"
                    disabled
                  >
                    Conferma modifiche
                  </button>
                )}
 
                <button
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                  onClick={() => {
                    FirebaseService.deletePiano(currentePianoId).then((response: any) => {    
                        console.log(response);
                        
                    });
                    navigate('./../'); // va messo che porta al profilo del pazinete 
                  }}
                >
                  Elimina Piano
                </button>
              </div>
              
              )}
            </>
          )}
        </div>
    );

    {isValid}
}

export default ModificaPiano;