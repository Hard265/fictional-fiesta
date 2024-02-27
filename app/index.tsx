import { Link, Stack, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Text, View, Pressable } from "react-native";
import Combobox from "../components/Combobox";
import { createRef, useState } from "react";

export default function Page() {
  const [mnemonic, _mnemonic] = useState<string>("");

  const handleMnemonicChange = (value: string) => {
    _mnemonic(value);
  };


  return (
    <View className="flex-1 flex p-4 items-center justify-end dark:bg-black">
      <View className="mt-32 mb-8">
        <Text className="text-lg text-center font-semibold text-black dark:text-white">
          Your seed phrase
        </Text>
        <Text className="text-center text-sm px-8 text-gray-600 dark:text-gray-400">
          Please enter your seed phrase to recover your existing address or
          create a new account.
        </Text>
      </View>
      <View className="w-full justify-center">
        {/* <Text className="font-semibold mb-2 dark:text-white">Seed phrase</Text> */}
        <Combobox onChangeText={handleMnemonicChange} />
        <Pressable onPress={()=>router.push('chat/')} className="w-full items-center justify-center mt-4 p-4 rounded-lg bg-gray-800 dark:bg-white dark:disabled:bg-red-600">
          <Text className="text-white font-medium dark:text-gray-800">
            Import address
          </Text>
        </Pressable>
      </View>
      <Pressable className="w-full items-center justify-center p-4 rounded-lg mt-auto bg-gray-800 dark:bg-gary-800 border dark:border-gray-700">
        <Text className="text-gray-50 font-medium">Create new address</Text>
      </Pressable>
      <StatusBar style="auto" />
    </View>
  );
}
