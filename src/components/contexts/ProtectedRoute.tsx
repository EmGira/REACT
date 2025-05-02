import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";
interface ProtectedRouteProps {
    isAuthenticated: boolean; // Pass authentication state
    isMedic: boolean;
    isPatient: boolean;
    requiredRole: string;
    redirect?: string;
}


export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ isAuthenticated, isPatient, isMedic, requiredRole}) => {
    const {loading} = useAuth();

    if(loading){
        return <div><p>SPINNER</p></div>        //da mettere effettivamente lo spinner
    }

    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
      }

    if (requiredRole === "patient" && !isPatient) {
        return <Navigate to="/" replace />; // Se non è paziente, viene reindirizzato
    }

    if (requiredRole === "medic" && !isMedic) {
        return <Navigate to="/" replace />; // Se è un paziente, non può accedere alle rotte per i medici
    }

    return <Outlet/>
} 