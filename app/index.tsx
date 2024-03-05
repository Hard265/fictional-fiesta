import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Pressable, TextStyle, View } from "react-native";
import Combobox from "../components/Combobox";
import { TextBlack, TextMedium, TextSemiBold } from "../components/Text";
import { Button, Chip, TextInput, useTheme } from "react-native-paper";
import { TextButtonStyle } from "../misc/styles";
import _ from "lodash";

export default function Page() {
  const [mnemonic, _mnemonic] = useState<string>("");
  const [chips, _chips] = useState<string[]>([]);

  const theme = useTheme();

  const handleMnemonicChange = (value: string) => {
    const newChips = value.split(" ");
    const lastIndex = _.size(newChips) - 1;

    _chips(
      _.chain(chips)
        .union(_.chain(newChips).splice(0, lastIndex).value())
        .value()
    );
    _mnemonic(newChips[lastIndex]);
    // onChangeText(_.chain(chips).concat([input]).join(" ").value());
  };

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
      <View className="w-full justify-center">
        {/* <Combobox onChangeText={handleMnemonicChange} /> */}
        <TextInput
          label="Seed phrase"
          value={mnemonic}
          mode="outlined"
          // numberOfLines={3}
          // multiline
          // render={(props) => {
          //   return (
          //     <View className="flex flex-row flex-wrap">
          //       {_.map(chips, (chip, index) => (
          //         <Chip  key={index}>{props.value}</Chip>
          //       ))}
          //       <TextInput
          //         value={props.value}
          //         onChangeText={handleMnemonicChange}
          //       />
          //     </View>
          //   );
          // }}
          onChangeText={handleMnemonicChange}
        />

        <Button
          disabled={_.isEmpty(mnemonic)}
          className="rounded-lg mt-2 p-1"
          labelStyle={[TextButtonStyle]}
          mode="contained"
          onPress={() => router.push("/chat")}
        >
          Import
        </Button>

        <Button
          className="rounded-lg mt-4 p-1"
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
