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
import { Button, Card, Modal, Portal, useTheme } from "react-native-paper";
import { TextMedium, TextSemiBold } from "../../components/Text";
import { TextButtonStyle } from "../../misc/styles";
import Shimmer from "../../components/Shimmer";

enum Dialog {
  DELETEUSER_CONFIRM,
}

export default observer(() => {
  const { address, displayName } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const db = useSQLiteContext();
  const theme = useTheme();

  const [modal, _modal] = useState<Dialog>();
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

  const onmute = ()=>{
    
  }

  const onblock = ()=>{
    
  }

  const ondelete = ()=>{
    router.replace("/chat")
  }

  return (
    <View className="flex-1 justify-end p-4 dark:bg-black">
      {!user ? (
        <View className="mb-auto flex flex-row gap-x-2 justify-start">
          <Shimmer className="rounded-lg self-center bg-gray-300 dark:bg-gray-900 my-0.5 w-32 h-32" />
          <Shimmer className="rounded-lg self-center bg-gray-300 dark:bg-gray-900 my-0.5 flex-1 mb-auto h-8" />
        </View>
      ) : (
        <View className="flex flex-row gap-x-2 mb-auto">
          <View className="bg-white p-2 ">
            <QRCode
              value={`klk://kloak.io/${user.address}/?publicKey=${user.publicKey}`}
              size={96}
            />
          </View>
          <TextMedium className="flex-1">{user.address}</TextMedium>
        </View>
      )}
      <Options title="Data Management">
        <Option label="Export Data" icon="download-cloud" isTrailing />
      </Options>
      <Options title="Privacy Controls">
        <Option disabled={!user} label="Mute notifications" icon="toggle-left" />
        <Option disabled={!user} label="Block" icon="toggle-left" isTrailing />
      </Options>

      <Button
        disabled={!user}
        className="rounded-lg mt-4"
        mode="contained-tonal"
        labelStyle={[TextButtonStyle]}
        buttonColor={theme.colors.errorContainer}
        textColor={theme.colors.onErrorContainer}
        onPress={ondelete}
      >
        Delete {displayName || address}
      </Button>
      <Portal>
        <Modal visible={modal === Dialog.DELETEUSER_CONFIRM}>
          <Text>Example Modal. Click outside this area to dismiss.</Text>
        </Modal>
      </Portal>
      <Stack.Screen
        options={{
          title: (displayName || address) as string,
        }}
      />
    </View>
  );
});
