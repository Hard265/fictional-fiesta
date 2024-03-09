import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

// Define the context shape
interface SocketContextType {
  connecting: boolean;
  isConnected: boolean;
  socket: SocketIOClient.Socket | null;
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
export const SocketProvider: React.FC<{ url: string }> = ({ url, children }) => {
  const [connecting, setConnecting] = useState<boolean>(true);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [socket, setSocket] = useState<SocketIOClient.Socket | null>(null);

  useEffect(() => {
    const newSocket = io(url);

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
  }, [url]);

  return (
    <SocketContext.Provider value={{ connecting, isConnected, socket }}>
      {children}
    </SocketContext.Provider>
  );
};
  
