import { router, Redirect } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Pressable, TextStyle, View } from "react-native";
import { Button, Chip, TextInput, useTheme } from "react-native-paper";
import _ from "lodash";

import { TextButtonStyle } from "../misc/styles";
import { TextBlack, TextMedium, TextSemiBold } from "../components/Text";

export default function Page() {
  const [mnemonic, _mnemonic] = useState("");
  
  const theme = useTheme();

  if(store.userStore.admin){
    return <Redirect href="/chat" />
  }

  return (
    <View className="flex-1 flex p-4 items-center justify-end dark:bg-black">
      <View className="mb-8">
        <TextBlack className="text-gray-900 dark:text-white text-5xl">
          Import your existing address
        </TextBlack>
        <TextMedium className="text-gray-500 dark:text-gray-100">
          Recover your existing address by entering the seed phrase for the
          address
        </TextMedium>
      </View>
      <View
        className="w-full justify-center"
      >
        <TextInput
          label="Seed phrase"
          value={mnemonic}
          mode="outlined"
          multiline
          numberOfLines={3}
          contentStyle={{
            paddingTop: 14,
            paddingBottom: 14
          }}
          onChangeText={
            handleMnemonicChange
          }
        />

        <Button
          disabled={_.isEmpty(mnemonic)}
          className="rounded-lg mt-2 p-0.5"
          labelStyle={[TextButtonStyle]}
          mode="contained"
          onPress={() => router.push("/chat")}
        >
          Import
        </Button>

        <Button
          className="rounded-lg mt-4 p-0.5"
          labelStyle={[TextButtonStyle]}
          mode="contained-tonal"
        >
          Create new address
        </Button>
      </View>

      <StatusBar style="auto" />
    </View>
  );
}
