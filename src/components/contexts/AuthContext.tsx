import { createContext, useContext, useState } from "react";
//import { onAuthStateChanged, User } from "firebase/auth";
//import { auth} from "../../configurations/FirebaseConfig.ts"

interface AuthContextType{
    authUser: any
    setAuthUser: React.Dispatch<React.SetStateAction<any>>;
    isLoggedIn: boolean;
    setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}



const AuthContext = createContext<AuthContextType>( {
    authUser: null,
    setAuthUser: () => {},
    isLoggedIn: false,
    setIsLoggedIn: () => {}
});

export function useAuth(){
    return useContext(AuthContext);
}

export function AuthProvider(props: any){               //gestisce e fornisce stato di autenticazione a tutti i componenti racchiusi in AuthProvider, (nel nostro caso APP)
    const[authUser, setAuthUser] = useState(null);
    const[isLoggedIn, setIsLoggedIn] = useState(false);

    const value = {
        authUser,
        setAuthUser,
        isLoggedIn,
        setIsLoggedIn
    };

    return(
        <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>         //passa value a tutti i componenti figli
    )
}


