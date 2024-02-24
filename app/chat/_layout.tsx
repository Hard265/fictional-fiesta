import { Stack } from "expo-router";
import { useColorScheme } from "nativewind";
import theme from "../../misc/theme";

export default function ChatLayout() {
    const { colorScheme } = useColorScheme();

    return (
        <Stack screenOptions={{
            headerStyle: {
                backgroundColor: theme[colorScheme].bg
            },
            headerTintColor: theme[colorScheme].tint
        }} />
    );
}