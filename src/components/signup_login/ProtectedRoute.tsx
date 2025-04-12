import { Navigate, Outlet } from "react-router-dom";

interface ProtectedRouteProps {
    isAuthenticated: boolean; // Pass authentication state
    redirect?: string;
}


//prende come pror isAthenticated, 
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ isAuthenticated, redirect = "/"}) => {
    return isAuthenticated ? <Outlet /> : <Navigate to={redirect} replace />;        //replace aggiorna la cronologia browser, user non puo tornare indietro alla pagina protetta
}                                                                                   //outlet renderizza componente figlio se autenticato

export default ProtectedRoute;