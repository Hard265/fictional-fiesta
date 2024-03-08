import { useCallback, useContext, useEffect, useState } from "react";
import { useAsyncState } from "./storage";
import { Socket, io } from "socket.io-client";
import { SocketContext } from "../providers/SocketProvider";

export
function useSocketState(socketUrl:string){
    const [state, setState] = useAsyncState<Socket>();
    const [isConnected,setIsConnected] = useState(false);

    

    useEffect(() => {
            const newSocket = io(socketUrl);
            newSocket.on('connect', () => {
                setIsConnected(true);
            });

            newSocket.on('disconnect', () => {
                setIsConnected(false);
            });

            setState(newSocket);

                                                // Clean up socket on unmount
            return () => {
                newSocket.disconnect();
            };
                         }, [socketUrl]);
    
     const setValue = useCallback((value:string )=>{
        
     },[])
    return {connecting:state[0], connection :state[1], setValue}
}

export default function useSocket(){
    const value = useContext(SocketContext)
    if (process.env.NODE_ENV !== 'production') {
        if (!value) {
            throw new Error('useSocketust must be wrapped in a <SocketProvider>')
        }
    }
    return value
}
