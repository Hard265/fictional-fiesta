import { Slot, Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import database from "../store/database";
import { Suspense, useEffect } from "react";
import { SQLiteProvider } from "expo-sqlite/next";
import { databaseInitHandler } from "../store/adapter";
import { Text } from "react-native";

export default function RootLayout() {
    return (
        <Suspense fallback={<Text>loading</Text>}>
            <SQLiteProvider databaseName="test.db" onInit={databaseInitHandler} useSuspense>
                <GestureHandlerRootView className="flex-1 flex">
                    <Slot />
                </GestureHandlerRootView>
            </SQLiteProvider>
        </Suspense>)
}