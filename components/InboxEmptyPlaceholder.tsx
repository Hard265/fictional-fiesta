import { View, Text } from "react-native";

export default function InboxEmptyPlaceholder() {
    return (<View className="flex-1 flex h-40 bg-red-600 self-center my-auto items-center">
        <Text className="text-gray-500 font-medium">No message</Text>
    </View>)
}