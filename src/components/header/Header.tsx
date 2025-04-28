import './Header.css'
//import {Link} from 'react-router-dom'

function Header(){
    return(
        <nav className="nav">
           <img src="logo.png" alt="logo" className='logo'/>

            <div className='dati'>
                <p>Log out</p>
                <img src="campanella.png" alt="notifiche" />
                <img src="profilo.png" alt="profilo" />
            </div>
        </nav>
    )
}

export default Header;