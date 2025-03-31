import CardUtente from '../../sub_components/card_utente/CardUtente';
import './Home.css'

function Home(){
    return (
        <>
            <div className='container'>
                <div className='pulsanti'>
                    <button>Pazienti</button>
                    <button>Farmaci</button>
                    <button>Appuntamenti</button>
                </div>
                <div className='griglia'>
                    <div className='centro'>
                        <CardUtente></CardUtente>
                        
                    </div>
                    <div className='centro'>
                        <CardUtente></CardUtente>
                        
                    </div>
                    <div className='centro'>
                        <CardUtente></CardUtente>
                        
                    </div>
                    <div className='centro'>
                        <CardUtente></CardUtente>
                        
                    </div>
                    <div className='centro'>
                        <CardUtente></CardUtente>
                        
                    </div>
                    <div className='centro'>
                        <CardUtente></CardUtente>
                        
                    </div>
                    <div className='centro'>
                        <CardUtente></CardUtente>
                        
                    </div>
                    <div className='centro'>
                        <CardUtente></CardUtente>
                        
                    </div>
                    <div className='centro'>
                        <CardUtente></CardUtente>
                        
                    </div>
                    <div className='centro'>
                        <CardUtente></CardUtente>
                        
                    </div>
                    <div className='centro'>
                        <CardUtente></CardUtente>
                        
                    </div>
                    <div className='centro'>
                        <CardUtente></CardUtente>
                        
                    </div>
                    <div className='centro'>
                        <CardUtente></CardUtente>
                        
                    </div>
                    <div className='centro'>
                        <CardUtente></CardUtente>
                        
                    </div>
                    <div className='centro'>
                        <CardUtente></CardUtente>
                        
                    </div>
                </div>
            </div>
        </>
    )
}

export default Home;