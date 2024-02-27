import { Feather } from "@expo/vector-icons";
import { Stack, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import _ from "lodash";
import { useEffect, useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Swipeable, TapGestureHandler } from "react-native-gesture-handler";
import Animated, {
  SlideInDown,
  SlideOutDown,
  ZoomIn,
  ZoomOut,
  useSharedValue,
} from "react-native-reanimated";
// import ScanQRBottomsheet from "../../components/ScanQRBottomsheet";
// import ScanQRCodePrompt from "../../components/ScanQRCodePrompt";
import { User } from "../../types/auth";
import { useColorScheme } from "nativewind";
import theme from "../../misc/theme";
import store from "../../store/store";
import { observer } from "mobx-react";
import { randomUUID } from "expo-crypto";
import { useSQLiteContext } from "expo-sqlite/next";
import { Database } from "../../store/adapter";
import ContactsModal from "../../components/Users";
import Users from "../../components/Users";
import ChatListItem from "../../components/ChatListItem";

type modalT = "finder" | "contacts" | "qrscanner" | null;

export default observer(() => {
  const { colorScheme } = useColorScheme();
  const [query, setQuery] = useState("");
  const [modal, setModal] = useState<modalT>(null);

  const db = useSQLiteContext();

  useEffect(() => {
    async function setup() {
      const results = (await db.getAllAsync("SELECT * FROM users")) as User[];
      store.pushUsers(results);
    }
    setup();
  }, []);

  const data =
    !_.isEmpty(query) && modal === "finder"
      ? _.filter(store.users, (user) =>
          user.displayName
            ? user.displayName.toLowerCase().includes(query.toLowerCase())
            : false
        )
      : store.users;

  function handleAddUser(): void {
    Database.pushUsers(db, [
      {
        address: randomUUID(),
        publicKey: randomUUID(),
        displayName: [
          "Mr Namakhwa",
          "Santos Runolfsdottir",
          "Mrs. Valerie Runte",
          "Shannon Heller",
          "Dorothy Abshire",
        ][_.random(4, false)],
      },
    ]);
  }

  return (
    <View className="flex flex-col flex-1 items-center justify-center dark:bg-black">
      <Stack.Screen
        options={{
          title: "Kasual",
          headerRight(props) {
            return (
              <>
                <View className="flex flex-row gap-x-4">
                  <Feather
                    name="book"
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
                    name="user"
                    size={24}
                    color={props.tintColor}
                    onPress={() => router.push("/chat/user")}
                  />
                </View>
              </>
            );
          },
        }}
      />
      <FlatList
        className="flex-1 w-full"
        data={data}
        renderItem={ChatListItem}
        keyExtractor={(item) => item.address}
        ListEmptyComponent={renderUsersEmpty}
      />
      {modal === "finder" ? (
        <>
          <Animated.View
            entering={SlideInDown}
            exiting={SlideOutDown}
            className="flex flex-row items-center gap-x-4 p-4 bg-white dark:bg-gray-800"
          >
            <TextInput
              value={query}
              onChangeText={setQuery}
              className="flex-1 rounded-lg p-2 placeholder:text-white border border-slate-300 bg-gray-200 dark:border-gray-700 dark:focus:border-gray-600 dark:bg-gray-900"
              placeholder="Find"
              placeholderTextColor={"gray"}
              returnKeyType="search"
            />
            <Pressable>
              <Feather
                name="x"
                size={24}
                color={theme[colorScheme].tint}
                onPress={() => setModal(null)}
              />
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
            <TapGestureHandler onActivated={handleAddUser}>
              <Feather name="plus" size={24} color={theme[colorScheme].bg} />
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

function renderUsersEmpty() {
  return (
    <>
      <View className="flex-1 items-center justify-center">
        <Text>No users</Text>
      </View>
    </>
  );
}
