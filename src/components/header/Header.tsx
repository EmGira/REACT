import './Header.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import { faCircleUser } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

//import {Link} from 'react-router-dom'

function Header(){

    const navigate = useNavigate();

    return(
        <nav className="nav">
           <img src="/src/assets/pharmaCare.png" alt="logo" className='logo' onClick={() => {navigate('/home')}}/>

            <div className='dati'>
                <p className='header-text'>Log out</p>
                <FontAwesomeIcon icon={faBell} className='header-icon'/>
                <FontAwesomeIcon icon={faCircleUser} className='header-icon'/>
            </div>
        </nav>
    )
}

export default Header;