import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";
interface ProtectedRouteProps {
    isAuthenticated: boolean; // Pass authentication state
    redirect?: string;
}


//prende come prop isAthenticated, 
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ isAuthenticated, redirect = "/"}) => {
    const {loading} = useAuth();

    if(loading){
        return <div><p>SPINNER</p></div>        //da mettere effettivamente lo spinner
    }
    if(!loading)
     return isAuthenticated ? <Outlet /> : <Navigate to={redirect} replace />;        //replace aggiorna la cronologia browser, user non puo tornare indietro alla pagina protetta
}                                                                                   //outlet renderizza componente figlio se autenticato

export default ProtectedRoute;