import { Feather } from "@expo/vector-icons";
import _ from "lodash";
import { createRef, useState } from "react";
import { View, Text, TextInput } from "react-native";

interface ComboboxProps {
  onChangeText: (value: string) => void;
}

export default function Combobox({ onChangeText }: ComboboxProps) {
  const inputRef = createRef<TextInput>();
  const [input, _input] = useState("");
  const [chips, _chips] = useState<string[]>([]);

  const handleInput = (value: string) => {
    const newChips = value.split(" ");
    const lastIndex = _.size(newChips) - 1;

    _chips(
      _.chain(chips)
        .union(_.chain(newChips).splice(0, lastIndex).value())
        .value()
    );
    _input(newChips[lastIndex]);
    onChangeText(_.chain(chips).concat([input]).join(" ").value());
  };

  return (
    <View className="flex flex-row flex-wrap w-full gap-1 p-2 items-center rounded-lg shadow-lg border border-gray-300 dark:border-gray-700 dark:focus:border-gray-400 bg-white dark:bg-gray-900 ">
      {_.map(chips, (chip, index) => (
        <View
          key={index}
          className="inline-flex items-center flex-row gap-x-2 p-2 rounded-xl border border-gray-300 dark:border-gray-700 dark:bg-gray-800"
        >
          <Text className="text-sm text-gray-300 dark:text-gray-500">
            {index + 1}
          </Text>
          <Text className="font-semibold text-gray-900 dark:text-gray-100">
            {chip}
          </Text>
          <Text className="text-gray-900 dark:text-gray-300">
            <Feather
              name="x-circle"
              size={16}
              onPress={() => _chips(_.difference(chips, [chip]))}
            />
          </Text>
        </View>
      ))}
      {_.size(chips) + 1 <= 12 && (
        <TextInput
          placeholder={"word " + (_.size(chips) + 1)}
          placeholderTextColor="#6B7280"
          className="shrink-0 flex-1 text-gray-900 dark:text-gray-100"
          ref={inputRef}
          value={input}
          autoCorrect={false}
          autoCapitalize="none"
          onChangeText={handleInput}
        />
      )}
    </View>
  );
}
