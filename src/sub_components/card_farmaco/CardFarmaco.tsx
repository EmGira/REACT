import './CardFarmaco.css'

function CardFarmaco({ farmaco }){
    return(
        <>
            <div className='cardContainer'>
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