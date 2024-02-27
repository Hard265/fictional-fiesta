import { Slot } from "expo-router";
import { SQLiteProvider } from "expo-sqlite/next";
import { Suspense } from "react";
import { Text } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { databaseInitHandler } from "../store/adapter";

export default function RootLayout() {
  return (
    <Suspense fallback={<Text>loading</Text>}>
      <SQLiteProvider
        databaseName="test.db"
        onInit={databaseInitHandler}
        useSuspense
      >
        <GestureHandlerRootView className="flex-1 flex">
          <Slot />
        </GestureHandlerRootView>
      </SQLiteProvider>
    </Suspense>
  );
}
