import './Header.css'
import {Link} from 'react-router-dom'
import FirebaseService from '../../services/FirebaseService'

function Header(){
    return(
        <nav className = "nav">
            <a href="/" className = "title">WELCOME!</a>
            <ul>
                <li>
                    <Link to = '/login'> Login </Link>
                </li>
                <li>
                     <Link to = '/clienti'> Clienti </Link>
                </li>
                <li>
                      <Link to = '/piani'> Piani </Link>
                </li>
                <li> 
                     <Link to = '/farmaci'> Farmaci </Link>
                </li>

                 {/* <button onClick = {() => FirebaseService.signUp("ema.giiiri@gmail.com", "PippoPlutoPippo12")}> signUp</button> */}
               
              

            </ul> 
        </nav>
    )
}

export default Header