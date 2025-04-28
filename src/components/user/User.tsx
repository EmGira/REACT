import { useState } from "react";
import "./User.css"
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import Profilo from "./profilo/Profilo";



  export const user:any = {
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


function User() {
    const navigate = useNavigate();
    const { name } = useParams(); 

    const image = ["/src/assets/user/manIcon.svg", "/src/assets/user/girlIcon.svg"];

    const icon = (genere : string) => {
        return user.genere === "M" ? image[0] : image[1];
    }   

    const[editColorButton, setEditColorButton] = useState(0);

    const button_menu = ["profilo", "registro", "piano"];


    const isAdmin = true;
    const [selectedButton, setSelectedButton] = useState((isAdmin?1:2));
    
    function selectButton(bottone: number) {
        setSelectedButton(bottone);
}



return(
    <div className="body_user">
        <div className="box_user">
            <div className="cerchio_icon">
                <img src={icon(user.genere)} className="icon"/>
            </div>
            <h1 className="h1_name_user">{user.nome} {user.cognome}</h1>

            <div className="pulsanti">
                {button_menu.map((name, index) => (
                <button key={name} onClick={() => {selectButton(index); navigate(`/user/${name}`)}} className={selectedButton==index?'selezionato':'non-selezionato'}>{name}</button>
                ))}


                {/* {button_menu.map((name) =>(
                    <button key={name} className="" onClick={() =>  navigate(`/user/${name}`)}>{name}</button>
                ))}       */}
            </div>

{/*
            <div className='pulsanti'>
                    {isAdmin && (<button onClick={() => selectButton(1)} className={selectedButton==1?'selezionato':'non-selezionato'}><p className='testo-button'>Pazienti</p></button>)}
                    <button onClick={() => selectButton(2)} className={selectedButton==2?'selezionato':'non-selezionato'}><p className='testo-button'>Farmaci</p></button>
                    <button onClick={() => selectButton(3)} className={selectedButton==3?'selezionato':'non-selezionato'}><p className='testo-button'>Appuntamenti</p></button>
            </div>
            */}
        </div>
        <Outlet />
    </div>
)

}

export default User;