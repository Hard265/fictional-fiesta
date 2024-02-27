import { Link, Stack, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Text, View, Pressable } from "react-native";
import Combobox from "../components/Combobox";
import { useState } from "react";

export default function Page() {
  const [mnemonic, _mnemonic] = useState<string>("");

  const handleMnemonicChange = (value: string) => {
    _mnemonic(value);
  };

  return (
    <View className="flex-1 flex p-4 items-center justify-end dark:bg-black">
      <View className="flex-1 w-full justify-center">
        <Text className="font-semibold mb-2 dark:text-white">Seed phrase</Text>
        <Combobox onChangeText={handleMnemonicChange} />
        <Pressable className="w-full items-center justify-center mt-3 p-3 rounded-full bg-gray-800 dark:bg-white">
          <Text className="text-white font-medium dark:text-gray-800">
            Import address
          </Text>
        </Pressable>
      </View>
      <Pressable className="w-full items-center justify-center p-3 rounded-full mt-auto bg-gray-800 dark:bg-gary-800 border dark:border-gray-700">
        <Text className="text-gray-50 font-medium">Create new address</Text>
      </Pressable>
      <StatusBar style="auto" />
    </View>
  );
}
