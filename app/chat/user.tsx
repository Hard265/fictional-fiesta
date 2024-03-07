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
import { Button, Card, Portal, useTheme } from "react-native-paper";
import { TextSemiBold } from "../../components/Text";
import { TextButtonStyle } from "../../misc/styles";
import Shimmer from "../../components/Shimmer";

enum Dialog {
  DELETEUSER
}

export default observer(() => {
  const { address, displayName } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const db = useSQLiteContext();
  const theme = useTheme();

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

  return (
    <View className="flex-1 justify-end p-4 dark:bg-black">
      {!user ? (
        <View className="mb-auto flex flex-row gap-x-2 justify-start">
          <Shimmer className="rounded-lg self-center bg-gray-300 dark:bg-gray-900 my-0.5 w-32 h-32" />
          <Shimmer className="rounded-lg self-center bg-gray-300 dark:bg-gray-900 my-0.5 flex-1 mb-auto h-8" />
        </View>
      ) : (
        <View className="mb-auto flex flex-row gap-x-2">
          <Card mode="outlined" className="rounded-lg p-1 h-32 w-32 flex items-center justify-center">
            <Card.Content className="">
              <QRCode
                size={96}
                value={`${user.address}?key=${user.publicKey}`}
              />
            </Card.Content>
          </Card>
          <Text
            numberOfLines={1}
            ellipsizeMode="middle"
            className="flex-1 items-center text-sm font-semibold dark:text-white"
          >
            {user.address} <Feather name="clipboard" size={20} />
          </Text>
        </View>
      )}
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

      <Button
        className="rounded-lg mt-4"
        mode="contained-tonal"
        labelStyle={[TextButtonStyle]}
        buttonColor={theme.colors.errorContainer}
        textColor={theme.colors.onErrorContainer}
        onPress={() => console.log("Pressed")}
      >
        Delete {displayName || address}
      </Button>
      <Portal>
        <Modal visibale={modal === Dialog.DELETEUSER}></Modal>
      </Portal>
      <Stack.Screen
        options={{
          title: (displayName || address) as string,
        }}
      />
    </View>
  );
});
