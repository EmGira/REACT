import { useState } from "react";
import "./User.css"



function User() {

    const image = ["/src/assets/user/manIcon.svg", "/src/assets/user/girlIcon.svg"];
    const user = {
        nome: "Mario",
        cognome: "Rossi",
        data: "23/03/1997",
        genere: "F",
        comune_di_nascita: "Verona",
        codice_fiscale: "RSSMRI05HB296T",
        indirizzo_residenza: "via Verona, 5b",
        comune_residenza: "Verona",
        stato: "Italia",
        numero_telefono: 3759950478,
        email: "mario.rossi@gmail.com",
    };

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
    <div className="body_user">
    <div className="box_user">
        <div className="cerchio_icon">
            <img src={icon(user.genere)} className="icon"/>
        </div>
        <h1 className="h1_name_user">{user.nome} {user.cognome}</h1>

        <div className="div_button_nav">
            <a className="profile_button">Profilo</a>
            <a className="registro_button">Registro</a>
            <a className="piano_button">Piano</a>
        </div>

        <div className="anagrafica">
            <h2>Anagrafica</h2>
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
            )}

        </div>


    </div>
    </div>

)

}

export default User;