import React from "react";
import { useStorageState } from "../hooks/storage";
import { User } from "../types/auth";
import { parseCookie, stringifyCookie } from "../helpers/utils";
import { useSQLiteContext } from "expo-sqlite/next";

const AuthContext = React.createContext<{
  signIn: (user: User) => void;
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
  const db = useSQLiteContext();

  const parsedSession = session ? (parseCookie(session) as User) : null;

  return (
    <AuthContext.Provider
      value={{
        signIn: (user: User) => {
          db.runSync(
            "INSERT OR IGNORE INTO users(address, publicKey, displayName) VALUES ($address, $publicKey, $displayName)",
            {
              $address: user.address,
              $publicKey: user.publicKey,
              $displayName: user.displayName || "",
            }
          );
          setSession(stringifyCookie(user));
        },
        signOut: () => {
          //TODO: delete all the rows in users and messages tabels
          db.runSync(
            "DELETE FROM users; DELETE FROM messages;"
          );
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
