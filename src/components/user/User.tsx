import { useEffect, useState } from "react";
import "./User.css"
import { useNavigate, useParams } from 'react-router-dom';
import Profilo from "./profilo/Profilo";
import { FirebaseService } from '../../services/FirebaseService';
import Registro from "./registro/Registro";
import Piano from "./piano/piano";

function User() {

    const [currentUser, setCurrentUser] = useState<any>(null);
    const [currentSlug, setCurrentSlug] = useState('');
    const [currentView, setCurrentView] = useState('');

    const [selectedButton, setSelectedButton]= useState(0);

    const { view, slug } = useParams();
    const navigate = useNavigate();

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
                    <h1 className="h1_name_user">{currentUser.nome} {currentUser.cognome}</h1>
        
                    <div className="pulsanti_user">
                        <button className={selectedButton==0?'selected':'no-selected'} onClick={() =>  {navigate(`/user/profilo/` + currentSlug); classNameButton(0)}} > profilo </button>
                        <button className={selectedButton==1?'selected':'no-selected'} onClick={() =>  {navigate(`/user/registro/` + currentSlug) ; classNameButton(1)}} > registro </button>
                        <button className={selectedButton==2?'selected':'no-selected'} onClick={() =>  {navigate(`/user/piano/` + currentSlug); classNameButton(2)}} > piano </button>
                    </div>
                </div>}

                <div className="contenuto_user">
                {currentView == 'registro' && <Registro></Registro>}
                {/* {currentView == 'profilo' && <Profilo user={currentUser}></Profilo>} */}
                {currentView == 'profilo' && <Profilo></Profilo>}
                {currentView == 'piano' && <Piano user={currentUser}></Piano>}
                </div>
            </div>
        </div>
    )

}

export default User;