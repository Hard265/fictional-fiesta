import { PropsWithChildren, createContext } from "react";
import { useSocketState } from "../hooks/socket";

const SocketContext = createContext<{
  connect: () => void;
  connected: boolean;
  loading: boolean;
  connection: any;
}>({
  connect: () => {},
  connected: false,
  loading: false,
  connection: null, //Socket instance
});

export function SocketProvider(props: PropsWithChildren) {
  const [[loading, connection], setConnection] = useSocketState("");

  return (
    <SocketContext.Provider
      value={{
        loading,
        connect() {
          connection?.connect();
        },
        connected: false,
        connection,
      }}
    >
      {props.children}
    </SocketContext.Provider>
  );
}

export { SocketContext };
