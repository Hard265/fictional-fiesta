import { View } from "react-native";
import { Text } from "./Text";

export function Avatar({ children, ...props }: { children: React.ReactNode }) {
  return (
    <View className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600" {...props}>
      <Text className="font-medium text-gray-600 dark:text-gray-300 uppercase">
        {children}
      </Text>
    </View>
  );
}
