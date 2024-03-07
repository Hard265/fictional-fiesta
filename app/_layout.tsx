import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_900Black,
  useFonts,
} from "@expo-google-fonts/inter";
import { Poppins_500Medium } from "@expo-google-fonts/poppins";
import { Slot } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { SQLiteProvider } from "expo-sqlite/next";
import { useColorScheme } from "nativewind";
import { Suspense, useCallback } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PaperProvider } from "react-native-paper";
import { TextMedium } from "../components/Text";
import theme from "../misc/theme";
import { SessionProvider } from "../providers/authenticationContext";
import { databaseInitHandler } from "../store/adapter";
import { useSession } from "../hooks/auth";

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  // Ensure any route can link back to `/`
  initialRouteName: 'chat',
  chat : {
    initialRouteName: 'index'
  }
};

export default function RootLayout() {
  const { colorScheme } = useColorScheme();

  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_900Black,
  });

  const themeSchema =
    colorScheme === "dark"
      ? {
          dark: true,
          colors: theme.dark,
          roundness: 8,
          isV3: true,
        }
      : {
          dark: false,
          roundness: 4,
          isV3: true,

          colors: theme.light,
        };

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  

  return (
    <Suspense fallback={<TextMedium>loading</TextMedium>}>
      <SessionProvider>
        <SQLiteProvider
          databaseName="test.db"
          onInit={databaseInitHandler}
          useSuspense
        >
          <PaperProvider theme={themeSchema}>
            <GestureHandlerRootView
              className="flex-1 flex"
              onLayout={onLayoutRootView}
            >
              <Slot initialRouteName="chat"/>
            </GestureHandlerRootView>
          </PaperProvider>
        </SQLiteProvider>
      </SessionProvider>
    </Suspense>
  );
}
