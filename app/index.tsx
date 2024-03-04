import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Pressable, View } from "react-native";
import Combobox from "../components/Combobox";
import { Heading, Text } from "../components/Text";
import Button from "../components/Button";

export default function Page() {
  const [mnemonic, _mnemonic] = useState<string>("");


  const handleMnemonicChange = (value: string) => {
    _mnemonic(value);
  };

  return (
    <View className="flex-1 flex p-4 items-center justify-end dark:bg-black">
      <View className="mt-32 mb-8">
        <Text className="text-5xl text-black dark:text-white">Import your existing address</Text>
        <Text className="text-center px-8 text-gray-500 dark:text-gray-400">
          Get started by recovering your existing address by entering the seed phrase for the address 
        </Text>
      </View>
      <View className="w-full justify-center">
        {/* <Text className="font-semibold mb-2 dark:text-white">Seed phrase</Text> */}
        <Combobox onChangeText={handleMnemonicChange} />
        <Pressable className="w-full items-center justify-center p-2.5 rounded-lg mt-auto bg-gray-800 dark:bg-gary-50 border dark:border-gray-700">
          <Text className="text-white dark:text-black font-medium">Import address</Text>
        </Pressable>
      </View>
      <Pressable className="w-full items-center justify-center p-2.5 rounded-lg mt-auto bg-gray-800 dark:bg-gary-800 border dark:border-gray-700">
        <Text className="text-gray-50 font-medium">Create new address</Text>
      </Pressable>
      <StatusBar style="auto" />
    </View>
  );
}
