import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
    Pressable,
    Text,
    TextInput,
    View,
} from "react-native";

export default function Page() {
    const [seed, setSeed] = useState("");

    const validateSeed = (seed: string) =>
        seed.split(" ").length === 12;

    const handleImport = () => {
        router.replace("/chat");
    };

    return (
        <View className="flex-1 flex items-center justify-center p-4 dark:bg-black">
            <View className="w-full flex flex-row items-center ">
                <Feather name="chevron-left" size={24} />
                <Text className="font-bold text-lg my-8 mx-auto">Import</Text>
            </View>
            <Text className="mb-4 text-center dark:text-white">
                Enter your 12-word seed phrase below. This
                phrase is used to securely restore your
                account.
            </Text>
            <TextInput
                clearButtonMode="unless-editing"
                value={seed}
                onChangeText={setSeed}
                secureTextEntry={true}
                autoCapitalize="none"
                multiline
                placeholder="Enter your 12-word seed phrase"
                className="w-full p-2.5 text-gray-900 text-sm rounded-lg bg-gray-200 border border-gray-300 focus:border-gray-400 dark:text-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:focus:border-gray-600"
            />

            <View className="mt-auto w-full">
                <Text className="dark:text-white">
                    By importing, I agree to the{" "}
                    <Text className="text-blue-600 dark:text-blue-500 underline">
                        Terms of Service
                    </Text>{" "}
                    and{" "}
                    <Text className="text-blue-500 underline">
                        Privacy Policy
                    </Text>
                </Text>
                <Pressable
                    onPress={handleImport}
                    className="w-full items-center justify-center p-3 rounded-xl bg-gray-800 dark:bg-white mt-2"
                >
                    <Text className="text-white font-semibold dark:text-gray-800 capitalize">
                        import
                    </Text>
                </Pressable>
            </View>
            <StatusBar style="auto" />
        </View>
    );
}
