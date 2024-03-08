import { useCallback, useContext, useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";
import { SocketContext } from "../providers/SocketProvider";
import { UseStateHook, useAsyncState } from "./common";

export function useSocketState(socketUrl: string): UseStateHook<Socket> {
    const [state, setState] = useAsyncState<Socket>();

    useEffect(() => {
        if (socketUrl) {
            const socket = io(socketUrl);
            socket.on("connect", () => {
                setValue(socket)
            });
            socket.on("disconnect", () => {
                setValue(socket)
            });
            setState(socket);
        }
    })

    const setValue = useCallback((value: Socket | null) => {
        setState(value);
    }, [socketUrl]);

    return [state, setValue]
}

export default function useSocket() {
    const value = useContext(SocketContext)
    if (process.env.NODE_ENV !== 'production') {
        if (!value) {
            throw new Error('useSocketust must be wrapped in a <SocketProvider>')
        }
    }
    return value
}
