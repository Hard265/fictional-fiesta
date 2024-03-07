import React from "react";
import { useStorageState } from "../hooks/storage";
import { User } from "../types/auth";
import { parseCookie, stringifyCookie } from "../helpers/utils";
import { SQLiteDatabase } from "expo-sqlite/next";

const AuthContext = React.createContext<{
  signIn: (db: SQLiteDatabase, user: User) => void;
  signOut: (db: SQLiteDatabase) => void;
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
        signIn: (db: SQLiteDatabase, user: User) => {
          db.runSync(
            "INSERT INTO users(address, publicKey, displayName) VALUES ($address, $publicKey, $displayName)",
            {
              $address: user.address,
              $publicKey: user.publicKey,
              $displayName: user.displayName || "",
            }
          );
          setSession(stringifyCookie(user));
        },
        signOut: (db: SQLiteDatabase) => {
          db.runSync("DROP TABLE users; DROP TABLE messages;");
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
