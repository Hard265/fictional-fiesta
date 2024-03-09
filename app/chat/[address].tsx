import { Feather } from "@expo/vector-icons";
import dayjs from "dayjs";
import { randomUUID } from "expo-crypto";
import { Stack, router, useLocalSearchParams } from "expo-router";
import { useSQLiteContext } from "expo-sqlite/next";
import _ from "lodash";
import { observer } from "mobx-react";
import { useColorScheme } from "nativewind";
import { createRef, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  SectionList,
  Text,
  TextInput,
  TextInput as TextInputType,
  View,
} from "react-native";
import store from "../../store/store";
import { User } from "../../types/auth";
import { Message } from "../../types/chat";
import { observable } from "mobx";
import InboxShimmer from "../../components/InboxShimmer";
import InboxEmptyPlaceholder from "../../components/InboxEmptyPlaceholder";
import { TextMedium, TextRegular } from "../../components/Text";
import colors from "tailwindcss/colors";
import { useSession } from "../../hooks/auth";
import { useMessageState } from "../../hooks/common";

export default observer(() => {
  const { address, displayName } = useLocalSearchParams<{address:string, displayName:string}>();
  const db = useSQLiteContext();
  const { session } = useSession();

  const inputRef = createRef<TextInputType>();
  const [input, _input] = useState("");
  const [selections, setSelections] = useState<string[]>([]);


  if(!session || !address) return null;

  useEffect(() => {
    async function setup() {
      const messages = await db.getAllAsync<Message>(
        "SELECT * FROM messages WHERE (sender = $address AND receiver = $admin) OR (sender = $admin AND receiver = $address)",
        { $address: address , $admin: session?.address  }
      );
      store.addMessages(db, messages)
    }
    setup();
  }, []);

  const messages: Message[] | undefined =
    store.messages[address];
  const sections = _.chain(messages)
    .sortBy("timestamp")
    .clone()
    .reverse()
    .groupBy((message) => dayjs(message.timestamp).format("MMM DD, YYYY"))
    .map((data, title) => ({ title, data }))
    .value();

  const handleSubmit = async () => {
    store.addMessages(db,[{
      id: randomUUID(),
      sender: session.address,
      receiver: address,
      content: input,
      timestamp: dayjs().toISOString(),
    }], session.address)
    _input("");
    inputRef.current?.blur();
  };

  const handleDeleteMessages = async () => {
    for (const id of selections) {
      // store.chatStore.delete(db, address as string, id);
    }
    setSelections([]);
  };

  return (
    <View className="flex-1 flex h-full items-center justify-center dark:bg-black">
      {!store.messages[address as string] ? (
        <InboxShimmer />
      ) : (
        <SectionList
          inverted
          className="flex-1 flex w-full h-full flex-col"
          sections={sections}
          renderSectionFooter={renderSectionFooter}
          renderItem={({ item }: { item: Message }) => {
            const { hideSubtitle, onPress } = useMessageState();

            // const handlePress = () => {
            //   if (!_.isEmpty(selections))
            //     setSelections((selections) => _.xor(selections, [item.id]));
            // };
            // const handleLongPress = () => {
            //   setSelections((selections) => _.xor(selections, [item.id]));
            // };


            if (_.isEqual(item.sender, session?.address)) {
              return (
                <>
                  <Pressable
                    className="w-full flex-col px-2 py-0.5 justify-end items-end"
                    onPress={onPress}
                  >
                    <View className="max-w-[80%] leading-1.5 p-4 rounded-lg shadow-lg border border-gray-200 bg-gray-50 dark:bg-gray-100">
                      <TextMedium className="text-sm text-gray-900">
                        {item.content.trim()}
                      </TextMedium>
                    </View>
                    {!hideSubtitle && (
                      <TextRegular className="text-xs text-right text-gray-600 dark:text-gray-400 p-0.5">
                        <Feather name="clock" size={12} />{' '}
                        {dayjs(item.timestamp).format("HH:mm")}
                      </TextRegular>
                    )}
                  </Pressable>
                </>
              );
            }
            return (
              <>
                <Pressable
                  className="w-full flex flex-col px-2 py-0.1 justify-start"
                  onPress={onPress}
                >
                  <View className="max-w-[80%] leading-1.5 p-4 rounded-lg shadow-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800">
                    <Text className="text-sm font-medium text-gray-900 dark:text-white">
                      {item.content.trim()}
                    </Text>
                  </View>
                  {!hideSubtitle && (
                      <TextRegular className="text-xs text-right text-gray-600 dark:text-gray-400">
                        {dayjs(item.timestamp).format("HH:mm")}
                      </TextRegular>
                    )}
                </Pressable>
              </>
            );
          }}
          keyExtractor={(item) => item.id}
        />
      )}
      <View className="w-full p-4 flex-row items-end bg-white dark:bg-black">
        <TextInput
          ref={inputRef}
          className="flex-1 font-['Inter\_500Medium'] justify-center p-2.5 px-4 rounded-lg text-black dark:text-white bg-gray-200 dark:bg-gray-800 border focus:border-gray-400 dark:focus:border-gray-400"
          value={input}
          placeholder="Aa.."
          placeholderTextColor={colors.gray[400]}
          onChangeText={_input}
          cursorColor={colors.gray[50]}
          multiline={true}
        />
        <Pressable
          className="rounded-xl items-center justify-center p-3 ml-4 bg-gray-900 dark:bg-gray-100"
          onPress={handleSubmit}
        >
          <Text className="text-gray-50 dark:text-gray-950">
            <Feather name="arrow-up" size={24} />
          </Text>
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

function renderSectionFooter({ section }: { section: { title: string } }) {
  return (
    <>
      <TextMedium className="text-center text-gray-600 dark:text-gray-400 capitalize my-2">
        {section.title}
      </TextMedium>
    </>
  );
}
