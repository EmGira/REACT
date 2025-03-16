import './Header.css'
import {Link} from 'react-router-dom'
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
               
              

            </ul> 
        </nav>
    )
}

export default Header