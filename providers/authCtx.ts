import React from "react";
import { useStorageState } from "../hooks/storage";

const AuthContext = React.createContext<{
    signIn: () => void;
    signOut: () => void;
    isLoading: boolean;

}>({
    signIn: () => null,
    signOut: () => null,
    isLoading: false,
});

function SessionProvider(params: React.PropsWithChildren) {
    const [[isLoading, session], setSession] = useStorageState('session');

    return <AuthContext.Provider value={{
        
    }}></AuthContext.Provider>;
}


export { AuthContext, SessionProvider }