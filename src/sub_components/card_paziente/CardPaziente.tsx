import { useNavigate } from 'react-router-dom';
import './CardPaziente.css';
import { slugifyService } from '@/services/SlugifyService';

function CardPaziente({paziente}: any){

    const navigate = useNavigate();

    function naviga() {
        navigate(`/user/profilo/${slugifyService.slugify(paziente.id,paziente.nome,paziente.cognome)}`);
    };

    return (
        <>
            <div onClick={()=>naviga()} className='cardContainer'>
                <img src={paziente.imgSrc} className={`card-immagine ${paziente.sesso === "m" ? 'maschio' : 'femmina'}`}/>
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