import { useEffect, useState } from "react";
import "./User.css"
import { useNavigate, useParams } from 'react-router-dom';
import Profilo from "./profilo/Profilo";
import { FirebaseService } from '../../services/FirebaseService';
import Registro from "./registro/Registro";
import Piano from "./piano/piano";



//   export const user:any = {
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


function User() {

    const [currentUser, setCurrentUser] = useState<any>(null);
    const [currentSlug, setCurrentSlug] = useState('');
    const [currentView, setCurrentView] = useState('');

    const { view, slug } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        

        if(view == null || slug == null){
            navigate('/');
            return;
        }

        setCurrentSlug(slug);
        setCurrentView(view);

        if(['piano','profilo','registro'].includes(view)){
            FirebaseService.getAllUsers().then((users: any) => {
                const user = users.find((u: any) => u.id == slug.split('-')[0]) || null;
                if(user == null){
                    navigate('/');
                    return;
                }
                else
                    setCurrentUser(user); 
            });
        }
        else{
            navigate('/');
            return; 
        }

    },[view, slug, navigate]);
    
    const image = ["/src/assets/user/manIcon.svg", "/src/assets/user/girlIcon.svg"];

    const icon = image[0];

    // const icon = (genere : string) => {
    //     return user.genere === "M" ? image[0] : image[1];
    // }   

    // const[editColorButton, setEditColorButton] = useState(0);


//     const isAdmin = true;
//     const [selectedButton, setSelectedButton] = useState((isAdmin?1:2));
    
//     function selectButton(bottone: number) {
//         setSelectedButton(bottone);
// }



    return(
        <div className="body_user">
            {currentUser != null && <div className="box_user">
                <div className="cerchio_icon">
                    <img src={icon} className="icon"/>
                </div>
                <h1 className="h1_name_user">{currentUser.nome} {currentUser.cognome}</h1>
    
                <div className="div_button_nav">
                    <button className="menu_button" onClick={() =>  navigate(`/user/profilo/` + currentSlug)}>profilo</button>
                    <button className="menu_button" onClick={() =>  navigate(`/user/registro/` + currentSlug)}>registro</button>
                    <button className="menu_button" onClick={() =>  navigate(`/user/piano/` + currentSlug)}>piano</button>
                </div>
            </div>}
            {currentView == 'registro' && <Registro></Registro>}
            {currentView == 'profilo' && <Profilo user={currentUser}></Profilo>}
            {currentView == 'piano' && <Piano user={currentUser}></Piano>}
        </div>
    )

}

export default User;