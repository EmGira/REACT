import './CreaFarmaci.css'
import { FirebaseService } from '../../services/FirebaseService';

function CreaFarmaci(){

    const farmaco = {
        descrizione: "wasdasdasdasda",
        nome: "prova 2",
        quantità: 11,
        scadenza: "02042025",
        srcImg: "asdas12d"
    };

    const addFarmcaco = async () => {
        await FirebaseService.addFarmaco(farmaco);
    }


    return(
        <>
            <h1>Crea un farmaco</h1>
            <button onClick={addFarmcaco}>crea</button>
        </>
    )
}

export default CreaFarmaci;