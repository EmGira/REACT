import { useEffect, useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import "../User.css"


function Piano({user}: any) {
  const navigate = useNavigate();

  const image = ["/src/assets/user/manIcon.svg", "/src/assets/user/girlIcon.svg"];

  const [currentSlug, setCurrentSlug] = useState('');
  const { slug } = useParams();
    // const user = {
    //     nome: "Mario",
    //     cognome: "Rossi",
    //     data: "23/03/1997",
    //     genere: "F",
    //     comune_di_nascita: "Verona",
    //     codice_fiscale: "RSSMRI05HB296T",
    //     indirizzo_residenza: "via Verona, 5b",
    //     comune_residenza: "Verona",
    //     stato: "Italia",
    //     numero_telefono: 3759950478,
    //     email: "mario.rossi@gmail.com",
    // };

  useEffect(() => {
    if(slug == null){
      navigate('/');
      return;
    }

    setCurrentSlug(slug);
  },[slug, navigate]);

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

  useEffect(() => {
    console.log(user)
  },[]);

return(
        <div className="anagrafica">

          <h1>Lista dei piani</h1>

          <div>piano 1</div>
          <div>piano 2</div>

          <div onClick={() => {navigate("/user/crea-piano/"+currentSlug)}}>Aggiungi un nuovo piano</div>
          {currentSlug}

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