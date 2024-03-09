import React, { PropsWithChildren, createContext, useContext, useEffect, useState } from 'react';
import io, {Socket} from 'socket.io-client';

// Define the context shape
interface SocketContextType {
  connecting: boolean;
  isConnected: boolean;
  socket: Socket | null;
}

// Create the context
const SocketContext = createContext<SocketContextType>({
  connecting: false,
  isConnected: false,
  socket: null,
});

// Custom hook to use the socket context
export const useSocket = () => useContext(SocketContext);

// Socket provider component
export function SocketProvider(props:PropsWithChildren<{url:string }>){
  const [connecting, setConnecting] = useState<boolean>(true);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io(props.url);

    newSocket.on('connect', () => {
      setConnecting(false);
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      setConnecting(false);
      setIsConnected(false);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [props.url]);

  return (
    <SocketContext.Provider value={{ connecting, isConnected, socket }}>
      {props.children}
    </SocketContext.Provider>
  );
};
  
