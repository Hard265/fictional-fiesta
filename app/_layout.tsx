import { Slot } from "expo-router";
import { SQLiteProvider } from "expo-sqlite/next";
import { Suspense, useCallback } from "react";
import { Text } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { databaseInitHandler } from "../store/adapter";
import * as SplashScreen from "expo-splash-screen";
import {
  useFonts,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <Suspense fallback={<Text>loading</Text>}>
      <SQLiteProvider
        databaseName="test.db"
        onInit={databaseInitHandler}
        useSuspense
      >
        <GestureHandlerRootView
          className="flex-1 flex"
          onLayout={onLayoutRootView}
        >
          <Slot />
        </GestureHandlerRootView>
      </SQLiteProvider>
    </Suspense>
  );
}
