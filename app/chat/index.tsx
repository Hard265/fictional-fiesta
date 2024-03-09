import { Feather } from "@expo/vector-icons";
import { Stack, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import _ from "lodash";
import { createRef, useEffect, useState } from "react";
import { FlatList, Pressable, TextInput, View } from "react-native";
import { Swipeable, TapGestureHandler } from "react-native-gesture-handler";
import Animated, {
  SlideInDown,
  SlideOutDown,
  ZoomIn,
  ZoomOut,
} from "react-native-reanimated";
// import ScanQRBottomsheet from "../../components/ScanQRBottomsheet";
// import ScanQRCodePrompt from "../../components/ScanQRCodePrompt";
import { randomUUID } from "expo-crypto";
import { useSQLiteContext } from "expo-sqlite/next";
import { observer } from "mobx-react";
import { useColorScheme } from "nativewind";
import Users from "../../components/Users";
import store from "../../store/store";
import { User } from "../../types/auth";
import {
  TextBlack,
  TextBold,
  TextMedium,
  TextRegular,
  TextSemiBold,
} from "../../components/Text";
import { Avatar, List, Text, useTheme } from "react-native-paper";
import { TextButtonStyle } from "../../misc/styles";
import colors from "tailwindcss/colors";
import { useSession } from "../../hooks/auth";
import { Message } from "../../types/chat";
import { other } from "../../helpers/utils";
import '../../shim'
import crypto from 'crypto'

type modalT = "finder" | "contacts" | "qrscanner" | null;

export default observer(() => {
  const { colorScheme } = useColorScheme();
  const theme = useTheme();
  const { session } = useSession();
  const [query, setQuery] = useState("");
  const [modal, setModal] = useState<modalT>(null);

  const db = useSQLiteContext();

  useEffect(() => {
    async function setup() {
      const messages = await db.getAllAsync<Message>(
        "SELECT m.* FROM messages m INNER JOIN ( SELECT sender, receiver, MAX(timestamp) AS max_timestamp FROM messages GROUP BY sender, receiver ) latest_messages ON m.sender = latest_messages.sender AND m.receiver = latest_messages.receiver AND m.timestamp = latest_messages.max_timestamp WHERE m.sender != m.receiver"
      );

      const columes = Array(messages.length).fill('?').join(",")
      
      const users = await db.getAllAsync<User>(
        `SELECT * FROM users WHERE address IN (${columes})`,
        messages.map((message) =>
          other(session?.address, message.sender, message.receiver)
        )
      );
      
      store.addUsers(db,users);
      store.addMessages(db,messages, session?.address ?? "");
    }
    setup();
  }, []);
 // console.log(crypto.randomBytes(128).toString("hex"));
  

  const data = _.chain(store.messages)
    .mapValues(chatMessages =>  _.maxBy(chatMessages, 'timestamp'))
    .compact()
    .value();

  return (
    <View className="flex flex-col flex-1 items-center justify-center dark:bg-black">
      <Stack.Screen
        options={{
          title: "Kloak",
          headerRight(props) {
            return (
              <>
                <View className="flex flex-row gap-x-4">
                  <Feather
                    name="users"
                    size={24}
                    color={props.tintColor}
                    onPress={() => setModal("contacts")}
                  />
                  <Feather
                    name="search"
                    size={24}
                    color={props.tintColor}
                    onPress={() => setModal("finder")}
                  />
                  <Feather
                    name="settings"
                    size={24}
                    color={props.tintColor}
                    onPress={() => router.push("/chat/settings")}
                  />
                </View>
              </>
            );
          },
        }}
      />
      <FlatList
        data={data}
        className="w-full"
        contentContainerStyle={{ alignItems: "flex-start" }}
        renderItem={({ item }) => {
          const user = _.find(store.users, [
            "address",
            other(session?.address, item.sender, item.receiver),
          ]);

          const handleSwipeDelete = (direction: "left" | "right") => {
            // store.userStore.delete(db, item.address).then(() => {
            //   itemRef.current?.close();
            // });
          };

          return (
            <Swipeable
              renderRightActions={() => (
                <View
                  style={{ backgroundColor: theme.colors.errorContainer }}
                  className="items-end justify-center w-full p-4"
                >
                  <Feather
                    name="trash"
                    size={24}
                    color={theme.colors.onErrorContainer}
                  />
                </View>
              )}
              onSwipeableOpen={handleSwipeDelete}
            >
              <List.Item
                onPress={() =>
                  router.push(
                    `chat/${user?.address}?displayName=${user?.displayName}`
                  )
                }
                title={user?.displayName || user?.address}
                description={item.content}
                className="py-0 dark:bg-black"
                left={() => (
                  <View className="rounded-full ml-1 p-3 bg-gray-300 dark:bg-gray-800">
                    <TextBold className="uppercase">
                      {user?.displayName?.substring(0, 2)}
                    </TextBold>
                  </View>
                )}
              />
            </Swipeable>
          );
        }}
        keyExtractor={(item) => item.id}
      />
      {modal === "finder" ? (
        <>
          <Animated.View
            entering={SlideInDown}
            exiting={SlideOutDown}
            className="flex flex-row items-center gap-x-4 p-2 border-t border-gray-300 dark:border-gray-800"
          >
            <TextInput
              value={query}
              onChangeText={setQuery}
              className="flex-1 rounded-lg p-2 placeholder:text-white border border-slate-300 bg-gray-200 dark:border-gray-700 dark:focus:border-gray-600 dark:bg-gray-900"
              placeholder="Find"
              autoFocus
              placeholderTextColor={colors.gray[600]}
              returnKeyType="search"
            />
            <Pressable>
              <Text>
                <Feather name="x" size={24} onPress={() => setModal(null)} />
              </Text>
            </Pressable>
          </Animated.View>
        </>
      ) : (
        <>
          <Animated.View
            className="absolute bottom-4 right-4 w-14 h-14 bg-gray-900 dark:bg-gray-100 rounded-xl items-center justify-center"
            entering={ZoomIn}
            exiting={ZoomOut}
          >
            <TapGestureHandler onActivated={()=>store.addUsers(db, [{address:randomUUID(),publicKey:'xxx', displayName:randomUUID()}])}>
              <Feather
                name="user-plus"
                size={24}
                color={theme.colors.background}
              />
            </TapGestureHandler>
          </Animated.View>
        </>
      )}
      {modal === "contacts" && <Users onRequestClose={() => setModal(null)} />}
      {/* <ScanQRBottomsheet visible={modal === 'qrscanner'} onScanQR={handleScannedQR} onRequestClose={() => setModal(null)} /> */}
      {/* <ScanQRCodePrompt isOpen={saveUserPromptShown} onRequestClose={() => setSaveUserPromptShown(false)} onConfirm={() => setSaveUserPromptShown(false)} /> */}
      <StatusBar style="auto" />
    </View>
  );
});
