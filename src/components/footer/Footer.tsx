
import './Footer.css'

function Footer(){

    return (
        <footer className="footer">
            <div className="footer-left">
            <h4>Progetto Universitario</h4>
            <p>Corso di laurea in Informatica</p>
            <p>Anno accademico 2024/2025</p>
            </div>

            <div className="footer-center">
            <h4>Sviluppatori</h4>
            <ul>
                <li>Edoardo Poltronieri – VR501425</li>
                <li>Emanuele Girardello – VR50XXXX</li>
                <li>Matteo Tessera – VR50XXXX</li>
            </ul>
            </div>

            <div className="footer-right">
            <h4>Contatti</h4>
            <p>edoardo.poltronieri@studenti.univr.it</p>
            <p>emanuele.girardello@studenti.univr.it</p>
            <p>matteo.tessera@studenti.univr.it</p>
            <p>© 2025 – Tutti i diritti riservati</p>
            </div>
        </footer>
    );

}

export default Footer;