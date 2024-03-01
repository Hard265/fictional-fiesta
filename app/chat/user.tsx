import { Stack, router, useLocalSearchParams, Navigator } from "expo-router";
import { observer } from "mobx-react";
import { Pressable, Text, View } from "react-native";
import store from "../../store/store";
import { Option, Options } from "../../components/Options";
import _ from "lodash";
import Prompt from "../../components/Prompt";
import { useEffect, useState } from "react";
import { useSQLiteContext } from "expo-sqlite/next";
import { User } from "../../types/auth";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import QRCode from "react-qr-code";

type modals = "deletion" | "block" | null;

export default observer(() => {
  const { address } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const db = useSQLiteContext();

  const [modal, _modal] = useState<modals>();
  const [user, _user] = useState<User | null>(null);

  useEffect(() => {
    async function setup() {
      const results = await db.getFirstAsync<User>(
        "SELECT * FROM users WHERE address = ?",
        _.toString(address)
      );
      _user(results);
    }
    setup();
  }, []);

  if (!user) return null;

  return (
    <View className="flex-1 justify-end p-2 dark:bg-black">
      <View className="mb-auto flex flex-row gap-x-2 p-4">
        <QRCode size={128} value={`${user.address}?key=${user.publicKey}`} />

        <Text numberOfLines={1} ellipsizeMode="middle" className="flex-1 items-center text-sm font-semibold dark:text-white">
          {user.address} <Feather name="clipboard" size={20} />
        </Text>
      </View>
      <Options title="Data Management">
        <Option label="Export Data" icon="download-cloud" isTrailing />
      </Options>
      <Options title="Privacy Controls">
        <Option label="Mute notifications" icon="toggle-left" />
        <Option
          label="Block"
          icon="toggle-left"
          isTrailing
          onTap={() => _modal("block")}
        />
      </Options>
      <Pressable
        className="flex flex-row justify-center w-full px-4 py-2.5 bg-red-500 mt-4 rounded-lg items-center"
        onPress={() => _modal("deletion")}
      >
        <Text
          ellipsizeMode="tail"
          numberOfLines={1}
          className="text-white font-medium"
        >
          Delete{" "}
          <Text className="font-semibold">
            {user.displayName || user.address}
          </Text>
        </Text>
      </Pressable>
      <Stack.Screen
        options={{
          title: user.displayName || user.address,
        }}
      />
    </View>
  );
      })
