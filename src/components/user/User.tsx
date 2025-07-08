import { useEffect, useState } from "react";
import "./User.css"
import { useNavigate, useParams } from 'react-router-dom';
import Profilo from "./profilo/Profilo";
import { FirebaseService } from '../../services/FirebaseService';
import Registro from "./registro/Registro";
import Piano from "./piano/piano";
import CalendarioPazienti from "../calendario/CalendarioPazienti";

function User() {

    const [currentUser, setCurrentUser] = useState<any>(null);
    const [currentSlug, setCurrentSlug] = useState('');
    const [currentView, setCurrentView] = useState('');

    const [selectedButton, setSelectedButton]= useState(0);

    const [medic, setMedic] = useState(false);


    const { view, slug } = useParams();
    const navigate = useNavigate();


    function verificaUtente () {
        if (slug) {
            try {
              // Ottieni i dati dell'utente usando lo slug (che è l'ID)
              const userId = slug.split('-')[0];
              FirebaseService.getUserData(userId).then((userData: any) => {
                if(userData != null)  {
                    if(userData.paziente==false){
                        setMedic(true);
                    }
                  }
              });
              
            } catch (error) {
              console.error("Errore nel recupero dei dati dell'utente", error);
            }
        }
    }

    useEffect(() => {
    
        if(view == null || slug == null){
            navigate('/');
            return;
        }

        setCurrentSlug(slug);
        setCurrentView(view);
        if(view == 'profilo')
            setSelectedButton(0)
        else if(view == 'registro')
            setSelectedButton(1);
        else if(view == 'piano')
            setSelectedButton(2);
        else if(view == 'calendario')
            setSelectedButton(3);

        if(['piano','profilo','registro','calendario'].includes(view)){
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

    let icon=image[0];

    function cambiaImmagine (genere : String){
        if(genere === 'm'){
            icon = image[0];
        } else if (genere === 'f') {
            icon = image[1];
        }
        console.log(genere);

        return icon;
    }


    function classNameButton (button: number){
        setSelectedButton(button);
    }



    return(
        <div className="">
            <div className="body_user">
                {currentUser != null && <div className="box_user">
                    <div className="cerchio_icon">
                        <img src={cambiaImmagine(currentUser.sesso)} className="icon"/>
                    </div>
                    <h1 className="h1_name_user">{currentUser.nome.toUpperCase()} {currentUser.cognome.toUpperCase()}</h1>
        
                    <div className="pulsanti_user">
                        <button className={selectedButton==0?'selected':'no-selected'} onClick={() =>  {navigate(`/user/profilo/` + currentSlug); classNameButton(0)}} > profilo </button>
                        {!medic &&
                        <>
                            {currentUser.paziente == true && <button className={selectedButton==1?'selected':'no-selected'} onClick={() =>  {navigate(`/user/registro/` + currentSlug) ; classNameButton(1)}} > registro </button>}
                            {currentUser.paziente == true && <button className={selectedButton==2?'selected':'no-selected'} onClick={() =>  {navigate(`/user/piano/` + currentSlug); classNameButton(2)}} > piano </button>}
                            {/* <button className={selectedButton==3?'selected':'no-selected'} onClick={() =>  {navigate(`/user/calendario/` + currentSlug); classNameButton(2)}} > calendario </button>   */}
                        </>
                        }
                        </div>
                </div>}

                <div className="contenuto_user">
                    {currentView == 'profilo' && <Profilo></Profilo>} 
                    {!medic && 
                        <>
                        {currentView == 'registro' && <Registro></Registro>}
                        {currentView == 'piano' && <Piano user={currentUser}></Piano>}
                        {currentView == 'calendario' && <CalendarioPazienti/>} 
                        
                        </>
                    }
                </div>
            </div>
        </div>        
    )

}

export default User;