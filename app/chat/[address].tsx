import { Feather } from "@expo/vector-icons";
import dayjs from "dayjs";
import { randomUUID } from "expo-crypto";
import { Stack, router, useLocalSearchParams } from "expo-router";
import { useSQLiteContext } from "expo-sqlite/next";
import _ from "lodash";
import { observer } from "mobx-react";
import { useColorScheme, useTailwind } from "nativewind";
import { createRef, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  SectionList,
  Text,
  TextInput as TextInputType,
  View,
} from "react-native";
import theme from "../../misc/theme";
import store from "../../store/store";
import { User } from "../../types/auth";
import { Message } from "../../types/chat";
import { observable } from "mobx";
import InboxShimmer from "../../components/InboxShimmer";
import InboxEmptyPlaceholder from "../../components/InboxEmptyPlaceholder";
import { TextMedium } from "../../components/Text";
import { IconButton, TextInput, useTheme } from "react-native-paper";

export default observer(() => {
  const { address, displayName } = useLocalSearchParams();

  const { colorScheme } = useColorScheme();
  const db = useSQLiteContext();
  const paperTheme = useTheme();
  const inputRef = createRef<TextInputType>();
  const [input, _input] = useState("");
  const [selections, setSelections] = useState<string[]>([]);

  useEffect(() => {
    async function setup() {
      store.chatStore.init(db, address as string);
    }
    setup();
  }, []);

  const adminAddress = store.userStore.admin.address;
  const messages: Message[] | undefined =
    store.chatStore.chats[address as string];
  const sections = _.chain(messages)
    .sortBy("timestamp")
    .clone()
    .reverse()
    .groupBy((message) => dayjs(message.timestamp).format("MMM DD, YYYY"))
    .map((data, title) => ({ title, data }))
    .value();

  const handleSubmit = async () => {
    store.chatStore.post(db, address as string, {
      id: randomUUID(),
      sender: adminAddress,
      receiver: address as string,
      content: input,
      timestamp: dayjs().toISOString(),
    });
    _input("");
    inputRef.current?.blur();
  };

  const handleDeleteMessages = async () => {
    for (const id of selections) {
      store.chatStore.delete(db, address as string, id);
    }
    setSelections([]);
  };

  return (
    <View className="flex-1 flex h-full items-center justify-center dark:bg-black">
      {!store.chatStore.chats[address as string] ? (
        <InboxShimmer />
      ) : (
        <SectionList
          inverted
          className="flex-1 flex w-full h-full flex-col"
          sections={sections}
          renderSectionHeader={renderSectionHeader}
          renderItem={({ item }: { item: Message }) => {
            const handlePress = () => {
              if (!_.isEmpty(selections))
                setSelections((selections) => _.xor(selections, [item.id]));
            };
            const handleLongPress = () => {
              setSelections((selections) => _.xor(selections, [item.id]));
            };

            const isSelected = selections.includes(item.id);

            if (_.isEqual(item.sender, adminAddress)) {
              return (
                <>
                  <Pressable
                    className="w-full flex-row px-2 py-1 justify-end items-end"
                    onPress={handlePress}
                    onLongPress={handleLongPress}
                  >
                    <View className="max-w-[80%] leading-1.5 p-4 rounded-lg shadow-lg border border-gray-200 bg-gray-50 dark:bg-gray-100">
                      <TextMedium className="text-sm text-gray-900">
                        {item.content.trim()}
                      </TextMedium>
                    </View>
                    {isSelected && (
                      <Text className="dark:text-white p-1 pb-0">
                        <Feather name="check-square" size={20} />
                      </Text>
                    )}
                  </Pressable>
                </>
              );
            }
            return (
              <>
                <Pressable
                  className="w-full flex px-2 py-1 justify-start"
                  onPress={handlePress}
                >
                  <View className="max-w-[80%] leading-1.5 p-4 rounded-lg shadow-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800">
                    <Text className="text-sm font-medium text-gray-900 dark:text-white">
                      {item.content.trim()}
                    </Text>
                  </View>
                </Pressable>
              </>
            );
          }}
          keyExtractor={(item) => item.id}
        />
      )}
      <View className="w-full p-4 gap-x-4 flex flex-row items-end bg-white dark:bg-black">
        <TextInput
          ref={inputRef}
          className="flex-1 justify-center"
          mode="outlined"
          value={input}
          placeholder="Aa.."
          contentStyle={{ paddingTop: 14, paddingBottom: 14 }}
          onChangeText={_input}
          multiline={true}
        />
        <Pressable
          className="rounded-xl items-center justify-center p-4"
          onPress={handleSubmit}
          style={{
            backgroundColor: paperTheme.colors.secondaryContainer,
          }}
        >
          <Feather
            name="arrow-up"
            size={24}
            color={paperTheme.colors.onSecondaryContainer}
          />
        </Pressable>
      </View>
      <Stack.Screen
        options={{
          title: (displayName || address || "") as string,
          headerRight(props) {
            return _.isEmpty(selections) ? (
              <Feather
                name="user"
                size={24}
                color={props.tintColor}
                onPress={() =>
                  router.push(
                    `chat/user?address=${address}&displayName=${displayName}`
                  )
                }
              />
            ) : (
              <Feather
                name="trash"
                size={24}
                color={props.tintColor}
                onPress={handleDeleteMessages}
              />
            );
          },
        }}
      />
    </View>
  );
});

function renderSectionHeader({ section }: { section: { title: string } }) {
  return (
    <>
      <Text className="text-center text-sm text-gray-500 dark:text-gray-600 capitalize my-2">
        {section.title}
      </Text>
    </>
  );
}
