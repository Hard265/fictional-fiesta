import { PropsWithChildren, createContext } from "react";
import { useSocketState } from "../hooks/socket";

const SocketContext = createContext<{
    connect:()=>void,
    connected:boolean,
    connecting:boolean,
    connection :any,
}>({
    connect :()=>{},
    connected:false,
    connecting:false,
    connection :null //Socket instance 
});

export function SocketProvider(props: PropsWithChildren){
    const {connecting,connection ,setValue} = useSocketState("")
    return (
        <SocketContext.Provider value={{
            connect() {
                //Connect to the socket 
            },
            connected:false,
            connecting,
            connection,
        }}>
            {props.children}
        </SocketContext.Provider>
    )
}

export {SocketContext}