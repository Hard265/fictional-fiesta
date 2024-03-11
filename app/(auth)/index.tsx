import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import _ from "lodash";
import { useState } from "react";
import { TextInput, View } from "react-native";
import { Button } from "react-native-paper";

import { useSQLiteContext } from "expo-sqlite/next";
import {
  TextBlack,
  TextMedium
} from "../../components/Text";
import { useSession } from "../../hooks/auth";
import { TextButtonStyle } from "../../misc/styles";

export default function Page() {
  const [mnemonic, _mnemonic] = useState("");
  const { signIn } = useSession();
  const db = useSQLiteContext();

  const handleContinue = async () => {
    signIn({
      address: "ee3c5216-3152-473a-8f17-c4adf8ba7bba",
      publicKey: "key",
      privateKey: "key",
    });
    router.push("/chat");
  };

  

  return (
    <View className="flex-1 flex p-4 items-center justify-end dark:bg-black">
      <View className=" w-full my-auto">
        <TextBlack className="text-gray-900 dark:text-white text-2xl">
          Restore Your Existing Address
        </TextBlack>
        <TextMedium className="text-gray-500 dark:text-gray-300">
          To reclaim access to your current address, input the seed phrase
          associated with that address.
        </TextMedium>

        <TextMedium className="mt-6">Enter Mnemonic Phrase:</TextMedium>
        <TextInput
          value={mnemonic}
          multiline
          numberOfLines={1}
          autoCapitalize="none"
          className="text-gray-900 dark:text-white font-['Inter\_500Medium'] p-2.5  w-full rounded-lg border-2 border-gray-300 dark:border-gray-500 dark:focus:border-gray-400"
          onChangeText={_mnemonic}
        />
        <TextMedium className="block text-xs text-right text-gray-400 dark:text-gray-500">
          {_.chain(mnemonic).trim().split(" ").size().value()}/12
        </TextMedium>

        <Button
          disabled={_.isEmpty(mnemonic)}
          className="rounded-lg mt-2 p-0.5"
          labelStyle={[TextButtonStyle]}
          mode="contained"
          onPress={handleContinue}
        >
          Continue
        </Button>
      </View>
      <Button
        className="rounded-lg mt-4 p-0.5 w-full"
        labelStyle={[TextButtonStyle]}
        mode="contained-tonal"
      >
        Create New Address
      </Button>

      <StatusBar style="auto" />
    </View>
  );
}
