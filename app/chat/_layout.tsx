import { Redirect, Stack } from "expo-router";
import { View } from "react-native";
import { ActivityIndicator, useTheme } from "react-native-paper";
import { useSession } from "../../hooks/auth";

export default function ChatLayout() {
  const theme = useTheme();
  const { session, isLoading } = useSession();

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center dark:bg-black">
        <ActivityIndicator size={"large"} />
      </View>
    );
  }

  if (!session) {
    return <Redirect href="/" />;
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
