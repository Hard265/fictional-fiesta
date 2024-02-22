import { Slot, Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import database from "../store/database";
import { useEffect } from "react";

export default function RootLayout() {
    useEffect(()=>{
        //database.init();
        database.db
    },[])
    return <GestureHandlerRootView className="flex-1 flex">
        <Slot/>
    </GestureHandlerRootView>
}