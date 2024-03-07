import { Redirect, Stack } from "expo-router";
import { useSession } from "../../hooks/auth";
import { ActivityIndicator, useTheme } from "react-native-paper";
import { View } from "react-native";

export default function ChatLayout() {
  const theme = useTheme();
  const { session, isLoading } = useSession();

  if (isLoading) {
    <View className="flex-1 justify-center items-center">
      <ActivityIndicator />
    </View>;
  }

  if (!session) {
    <Redirect href="/" />;
  }

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.background,
        },
        headerTintColor: theme.colors.onBackground,
      }}
    />
  );
}
