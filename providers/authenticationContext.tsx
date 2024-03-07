import React from "react";
import { useStorageState } from "../hooks/storage";
import { User } from "../types/auth";
import { parseCookie } from "../helpers/utils";

const AuthContext = React.createContext<{
  signIn: () => void;
  signOut: () => void;
  session: User | null;
  isLoading: boolean;
}>({
  signIn: () => null,
  signOut: () => null,
  session: null,
  isLoading: false,
});

function SessionProvider(props: React.PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState("session");

  const parsedSession = session ? (parseCookie(session) as User) : null;

  return (
    <AuthContext.Provider
      value={{
        signIn: () => {
          // Perform sign-in logic here
          setSession("xxx");
        },
        signOut: () => {
          setSession(null);
        },
        isLoading,
        session: parsedSession,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}

export { AuthContext, SessionProvider };
