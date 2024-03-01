import { Slot } from "expo-router";
import { SQLiteProvider } from "expo-sqlite/next";
import { Suspense, useCallback, useEffect, useState } from "react";
import { View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { databaseInitHandler } from "../store/adapter";
import * as SplashScreen from "expo-splash-screen";
import {
  useFonts,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import * as LocalAuthentication from 'expo-local-authentication'
import { Heading, Text } from "../components/Text";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [fontsLoaded, fontError] = useFonts({
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    async function setup() {
      const results = await LocalAuthentication.authenticateAsync({ promptMessage: 'finger print please' })
      setIsAuthenticated(results.success)
    };
    setup();
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  if (!isAuthenticated) {
    return <View className='flex-1 justify-center items-center p-2 dark:bg-black'>
      <Heading className='text-2xl font-medium'>Please authenticate</Heading>
    </View>
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
