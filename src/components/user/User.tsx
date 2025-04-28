import { useState } from "react";
import "./User.css"
import { Outlet, useNavigate, useParams } from 'react-router-dom';



function User() {
    const navigate = useNavigate();
    const { name } = useParams(); 

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

    const[editColorButton, setEditColorButton] = useState(0);

    const button_menu = ["profilo", "registro", "piano"];


return(
    <div className="body_user">
        <div className="box_user">
            <div className="cerchio_icon">
                <img src={icon(user.genere)} className="icon"/>
            </div>
            <h1 className="h1_name_user">{user.nome} {user.cognome}</h1>

            <div className="div_button_nav">
                {button_menu.map((name) =>(
                    <button key={name} className="menu_button" onClick={() =>  navigate(`/user/${name}`)}>{name}</button>
                ))}
            </div>
        </div>
        <Outlet />
    </div>
)

}

export default User;