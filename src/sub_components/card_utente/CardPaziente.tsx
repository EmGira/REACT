import { useNavigate } from 'react-router-dom';
import './CardPaziente.css'

function CardPaziente({paziente}){

    const navigate = useNavigate();

    function naviga() {
        navigate(`/user/${paziente.id}`);
    };

    return (
        <>
            <div onClick={()=>naviga()} className='cardContainer'>
                <img src={paziente.imgSrc} className={`card-immagine ${paziente.sesso === "M" ? 'maschio' : 'femmina'}`}/>
                <div className={'card-data'}>
                    <p className='testo'> {paziente.nome.toUpperCase()}</p>
                    <p className='testo'>{paziente.cognome.toUpperCase()}</p>
                </div>
                <button className='card-button'>Vedi</button>
            </div>
        </>
    )
}

export default CardPaziente;