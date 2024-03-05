import { Feather } from "@expo/vector-icons";
import { Stack, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import _ from "lodash";
import { useEffect, useState } from "react";
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
import theme from "../../misc/theme";
import store from "../../store/store";
import { User } from "../../types/auth";
import { TextBlack, TextBold, TextMedium } from "../../components/Text";
import { Avatar, List } from "react-native-paper";
import { TextButtonStyle } from "../../misc/styles";

type modalT = "finder" | "contacts" | "qrscanner" | null;

export default observer(() => {
  const { colorScheme } = useColorScheme();
  const [query, setQuery] = useState("");
  const [modal, setModal] = useState<modalT>(null);

  const db = useSQLiteContext();

  useEffect(() => {
    async function setup() {
      store.userStore.init(db);
    }
    setup();
  }, []);

  const data =
    !_.isEmpty(query) && modal === "finder"
      ? _.filter(store.userStore.users, (user) =>
          user.displayName
            ? user.displayName.toLowerCase().includes(query.toLowerCase())
            : false
        )
      : store.userStore.users;

  function handleAddUser(): void {
    store.userStore.post(db, {
      address: randomUUID(),
      publicKey: randomUUID(),
      displayName: [
        "Mr Namakhwa",
        "Santos Runolfsdottir",
        "Mrs. Valerie Runte",
        "Shannon Heller",
        "Dorothy Abshire",
      ][_.random(4, false)],
    });
  }

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
        renderItem={({ item }: { item: User }) => {
          return (
            <List.Item
              onPress={() =>
                router.push(
                  `chat/${item.address}?displayName=${item.displayName}`
                )
              }
              title={item.displayName || item.address}
              description={item.address}
              className="py-0"
              left={() => (
                <Avatar.Text
                  size={40}
                  className="ml-2 bg-gray-100 dark:bg-gray-600"
                  labelStyle={[TextButtonStyle]}
                  label={(item.displayName || item.address)
                    .substring(0, 2)
                    .toLocaleUpperCase()}
                />
              )}
            />
          );
        }}
        keyExtractor={(item) => item.address}
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
              <Feather
                name="user-plus"
                size={24}
                color={theme[colorScheme].bg}
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
