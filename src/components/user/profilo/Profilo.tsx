import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import "../User.css"
import "../User"
import { User } from "firebase/auth";
import { user } from "../User";

function Profilo() {
    const navigate = useNavigate();

    const image = ["/src/assets/user/manIcon.svg", "/src/assets/user/girlIcon.svg"];
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

return(
        <div className="anagrafica">

            <h2>Informazioni personali</h2>
            <hr className="linea_h2"/>
            {!editMode && (
                <button onClick={handleModifica} className="button_modifica">Modifica</button>
            )}
            <div className="profilo_user">
                {Object.entries(user).map(([key, value]) => (
                <div key={key} className="input-box">
                    <label className="label_anagrafica">{key}</label>
                    <input type="text" value={String(value)} readOnly className="input_anagrafica"/>
                </div>
                ))}
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

export default Profilo;