import { router } from "expo-router";
import _ from "lodash";
import { Animated, Pressable, View, Text } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { User } from "../types/auth";
import { Feather } from "@expo/vector-icons";

interface ChatListItemProps {
  item: User;
}

export default function ChatListItem({ item }: ChatListItemProps) {
  const handlePress = () => router.push(`/chat/${item.address}`);

  const rightSwipe = () => {
    return (
      <View className="w-[100px] flex items-center justify-center bg-red-600 dark:bg-red-500">
        <Feather name="trash" color="white" size={20} />
      </View>
    );
  };
  return (
    <Swipeable renderRightActions={rightSwipe}>
      <Pressable className="flex flex-row gap-4 px-4 py-1">
        <View className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
          <Text className="font-medium text-gray-600 dark:text-gray-300 uppercase">
            {(item.displayName || item.address).substring(0, 2)}
          </Text>
        </View>
        <View>
          <Text className="text-sm font-medium text-gray-900 dark:text-white">
            {item.displayName || item.address}
          </Text>
          {item.displayName && (
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              className="text-sm text-gray-500 truncate dark:text-gray-400"
            >
              {item.address}
            </Text>
          )}
        </View>
      </Pressable>
    </Swipeable>
  );
}
