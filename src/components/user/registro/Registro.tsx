import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import "../User.css"


function Registro() {
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

return(
        <div className="anagrafica">

            <h2>Registro farmaci</h2>
            <hr className="linea_h2"/>
            {!editMode && (
                <button onClick={handleModifica} className="button_modifica">Modifica</button>
            )}
            <div className="profilo_user">
               
            </div>
            {editMode && (
            <div className="tasti_modifica">
              <button  onClick={handleAnnulla}>Annulla</button>
              <button onClick={handleInvia}>Invia</button>
            </div>
            )}

        </div>



)

}

export default Registro;