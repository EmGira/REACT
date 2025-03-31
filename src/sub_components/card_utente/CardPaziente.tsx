import './CardPaziente.css'

function CardPaziente({paziente}){
    return (
        <>
            <div className={`cardContainer ${paziente.sesso === "M" ? 'maschio' : 'femmina'}`}>
                <img src={paziente.imgSrc} className='card-immagine'/>
                <div className={'card-data'}>
                    <p className='testo'><strong>Nome:</strong> {paziente.nome}</p>
                    <p className='testo'><strong>Cognome:</strong> {paziente.cognome}</p>
                    <p className='testo'><strong>Sesso:</strong> {paziente.sesso}</p> 
                </div>
                <p style={{position:'absolute',bottom:'2vh',right:'2vh',margin:'0'}}>{paziente.id}</p>
            </div>
        </>
    )
}

export default CardPaziente;