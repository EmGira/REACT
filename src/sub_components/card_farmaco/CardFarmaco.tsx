import './CardFarmaco.css'

function CardFarmaco({ farmaco }){
    return(
        <>
            <div className='cardContainer'style={{backgroundColor:'green'}}>
                <img src={farmaco.imgSrc} className='card-immagine'/>
                <div className={'card-data'}>
                    <p className='testo'><strong>Nome:</strong> {farmaco.nome}</p>
                    <p className='testo'><strong>Descrizione:</strong> {farmaco.descrizione}</p>
                    {/* <p><strong>Scadenza:</strong> {farmaco.scadenza}</p>          */}
                    <p className='testo'><strong>Scadenza:</strong> XX-XX-XXXX</p> 
                </div>
                <p style={{position:'absolute',bottom:'2vh',right:'2vh',margin:'0'}}>{farmaco.id}</p>
            </div>
        </>
    )
}

export default CardFarmaco;