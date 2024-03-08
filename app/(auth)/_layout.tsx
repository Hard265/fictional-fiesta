import { Redirect, Slot } from "expo-router";
import { useSession } from "../../hooks/auth";
import { ActivityIndicator } from "react-native-paper";
import { View } from "react-native";

export default function AuthLayout() {
  const { session, isLoading } = useSession();

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center dark:bg-black">
        <ActivityIndicator size={"large"} />
      </View>
    );
  }

  if (session) {
    return <Redirect href="/chat" />;
  }

  return <Slot />;
}
