import { createContext, useContext, useEffect, useState } from "react";
//import { onAuthStateChanged, User } from "firebase/auth";
//import { auth} from "../../configurations/FirebaseConfig.ts"

interface AuthContextType{
    authUser: any
    setAuthUser: React.Dispatch<React.SetStateAction<any>>;
    isLoggedIn: boolean;
    setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
    isPatient: boolean;
    setIsPatient: React.Dispatch<React.SetStateAction<boolean>>;
    isMedic: boolean;
    setIsMedic: React.Dispatch<React.SetStateAction<boolean>>;
    loading: boolean;

}



const AuthContext = createContext<AuthContextType>( {
    authUser: null,
    setAuthUser: () => {},
    isLoggedIn: false,
    setIsLoggedIn: () => {},
    isPatient: false,
    setIsPatient: () => {},
    isMedic: false,
    setIsMedic: () => {},
    loading: true

});

export function useAuth(){
    return useContext(AuthContext);
}

export function AuthProvider(props: any){               //gestisce e fornisce stato di autenticazione a tutti i componenti racchiusi in AuthProvider, (nel nostro caso APP)
    const[authUser, setAuthUser] = useState(null);
    const[isLoggedIn, setIsLoggedIn] = useState(false);
    const[isPatient, setIsPatient] = useState(false);
    const[isMedic, setIsMedic] = useState(false);
    const[loading, setLoading] = useState(true);

    useEffect(() => {
        //quando carico un componente, provo cercare in localStorage
        const storedUser = localStorage.getItem('authUser');
        const storedLoggedIn = localStorage.getItem('isLoggedIn');
        const storedIsPatient = localStorage.getItem('isPatient')
        const storedIsMedic = localStorage.getItem('isMedic')

        if (storedUser) {
            setAuthUser(JSON.parse(storedUser));
        }

        if (storedLoggedIn === 'true') {
            setIsLoggedIn(true);
        }

        if (storedIsPatient === 'true') {
            setIsPatient(true);
        }
        if (storedIsMedic === 'true') {
            setIsMedic(true);
        }

        setLoading(false);
    }, []);
    

    const value = {
        authUser,
        setAuthUser,
        isLoggedIn,
        setIsLoggedIn,
        isPatient,
        setIsPatient,
        isMedic,
        setIsMedic,
        loading
    };

    

    return(
        <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>         //passa value a tutti i componenti figli
    )
}


