import { Feather } from "@expo/vector-icons";
import { Stack, router, useLocalSearchParams } from "expo-router";
import _ from "lodash";
import { observer } from "mobx-react";
import { Pressable, SectionList, Text, TextInput, View } from "react-native";
import store from "../../store/store";
import { createRef, useEffect, useState } from "react";
import { useSQLiteContext } from "expo-sqlite/next";
import { User } from "../../types/auth";
import { Message } from "../../types/chat";
import dayjs from "dayjs";
import theme from "../../misc/theme";
import { useColorScheme } from "nativewind";
import { Database } from "../../store/adapter";
import { randomUUID } from "expo-crypto";
import Progress from "react-native-progress";

export default observer(() => {
  const { address } = useLocalSearchParams();
  const { colorScheme } = useColorScheme();
  const db = useSQLiteContext();

  const scrollerRef = createRef<SectionList>();
  const inputRef = createRef<TextInput>();
  const [input, _input] = useState("");
  const [user, _user] = useState<User | null>();
  const [messages, _messages] = useState<Message[]>([]);

  useEffect(() => {
    async function setup() {
      const $user = await db.getFirstAsync<User>(
        "SELECT * FROM users WHERE address = ?",
        _.toString(address)
      );

      if ($user) {
        const results = await db.getAllAsync<Message>(
          "SELECT * FROM messages WHERE (sender = ? AND receiver = ?) OR (sender = ? AND receiver = ?)",
          $user.address,
          store.admin.address,
          store.admin.address,
          $user.address
        );
        _user($user);
        _messages(results);
      }
    }
    setup();
  }, []);

  if (!user)
    return (
      <View className="flex-1 flex h-full items-center justify-center dark:bg-black">
        <Text className="text-4xl font-black dark:text-gray-400">loading</Text>
      </View>
    );

  const sections = _.chain(messages)
    .sortBy("timestamp")
    .clone()
    .reverse()
    .groupBy((message) => dayjs(message.timestamp).format("MMM DD, YYYY"))
    .map((data, title) => ({ title, data }))
    .value();

  const handleSubmit = async () => {
    const message: Message = {
      id: randomUUID(),
      sender: store.admin.address,
      receiver: user.address,
      content: input,
      timestamp: dayjs().toISOString(),
    };

    await db.runAsync(
      "INSERT INTO messages (id, sender, receiver, content, timestamp) VALUES ($id, $sender, $receiver, $content, $timestamp)",
      _.values(message)
    );
    _messages(_.unionBy(messages, [message], "id"));
    _input("");
    inputRef.current?.blur();
    scrollerRef.current?.scrollToLocation({
      sectionIndex: _.size(sections) - 1,
      itemIndex: 1,
    });
  };

  return (
    <View className="flex-1 flex h-full items-center justify-center dark:bg-black">
      <SectionList
        ref={scrollerRef}
        inverted
        className="flex-1 flex w-full h-full flex-col"
        sections={sections}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />

      <View className="w-full p-4 gap-x-4 flex flex-row items-end bg-white dark:bg-black">
        <TextInput
          ref={inputRef}
          placeholder="Aa..."
          placeholderTextColor={"gray"}
          value={input}
          onChangeText={_input}
          className="flex-1 p-2.5 text-black dark:text-white text-sm rounded-lg bg-gray-200 border border-gray-300 focus:border-gray-400 dark:bg-gray-800 dark:border-gray-700 dark:focus:border-gray-600"
          multiline
          numberOfLines={1}
        />
        <Pressable
          className="rounded-xl items-center justify-center p-3.5 bg-gray-900 dark:bg-gray-50"
          onPress={handleSubmit}
        >
          <Feather name="arrow-up" size={20} color={theme[colorScheme].bg} />
        </Pressable>
      </View>

      <Stack.Screen
        options={{
          title: user.displayName || user.address,
          // headerLeft: _.isEmpty(selected) ? undefined : (props) => (<Feather name="x" color={props.tintColor} size={24} />),
          headerRight(props) {
            return (
              <Feather
                name="user"
                size={24}
                color={props.tintColor}
                onPress={() => router.push(`chat/user?address=${user.address}`)}
              />
            );
          },
        }}
      />
    </View>
  );
});

function renderItem({ item }: { item: Message }) {
  const handlePress = () => {};
  if (_.isEqual(item.sender, store.admin.address)) {
    return (
      <>
        <Pressable
          className="w-full flex px-2 py-1 items-end"
          onPress={handlePress}
        >
          <View className="max-w-[80%] leading-1.5 p-4 rounded-lg shadow-lg border border-gray-200 bg-gray-50 dark:bg-gray-100">
            <Text className="text-sm font-medium text-gray-900">
              {item.content}
            </Text>
          </View>
        </Pressable>
      </>
    );
  }
  return (
    <>
      <Pressable
        className="w-full flex px-2 py-1 items-end"
        onPress={handlePress}
      >
        <View className="max-w-[80%] leading-1.5 p-4 rounded-lg shadow-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800">
          <Text className="text-sm font-medium text-gray-900 dark:text-white">
            {item.content}
          </Text>
        </View>
      </Pressable>
    </>
  );
}

function renderSectionHeader({ section }: { section: { title: string } }) {
  return (
    <>
      <Text className="text-center text-sm text-gray-500 dark:text-gray-600 capitalize my-2">
        {section.title}
      </Text>
    </>
  );
}

function emptyListComponent() {
  return (
    <View className="flex-1 flex justify-center my-auto items-center">
      <Text className="text-gray-500 font-medium">No message</Text>
    </View>
  );
}
