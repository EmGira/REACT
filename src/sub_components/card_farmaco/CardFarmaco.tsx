import { useNavigate } from 'react-router-dom';
import './CardFarmaco.css'
import { slugifyService } from '@/services/SlugifyService';

function CardFarmaco({ farmaco }: any){

    const navigate = useNavigate();



    return(
        <>
            <div className='cardContainer' onClick={() => {
                navigate('/farmaco/' + slugifyService.slugifyFarmaco(farmaco.id,farmaco.nome));
            }}>
                <img src={farmaco.imgSrc} className='card-immagine' style={{backgroundColor:'green'}}/>
                <div className={'card-data'}>
                    <p className='testo'>{farmaco.nome.toUpperCase()}</p>
                    {/* <p><strong>Scadenza:</strong> {farmaco.scadenza}</p>          */}
                </div>
                <button className='card-button'>Vedi</button>

            </div>
        </>
    )
}

export default CardFarmaco;