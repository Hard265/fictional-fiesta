import { Pressable, View } from "react-native";
import { Option, Options } from "../../components/Options";
import { TextMedium } from "../../components/Text";
import { Button, useTheme } from "react-native-paper";
import { TextButtonStyle } from "../../misc/styles";
import QRCode from "react-qr-code";
import { useSession } from "../../hooks/auth";

export default function Page() {
  const theme = useTheme();
  const { session } = useSession();

  const url = `klk://kloak.io/${session?.address}/?publicKey=${session?.publicKey}`;
  

  return (
    <View className="flex-1 justify-end p-4 dark:bg-black">
      <View className="flex flex-row gap-x-2 mb-auto">
        <View className="bg-white p-2 ">
          <QRCode value={url} size={96} />
        </View>
        <TextMedium className="flex-1">{session?.address}</TextMedium>
      </View>
      <Options title="theme">
        <Option label="system" icon="circle" />
        <Option label="Light" icon="circle" />
        <Option label="dark" icon="circle" isTrailing />
      </Options>
      <Options title="Privacy Controls">
        <Option label="Visibility Settings" icon="chevron-right" />
        <Option label="Block List" icon="chevron-right" isTrailing />
      </Options>
      <Options title="Security Settings">
        <Option label="Two-Factor Authentication (2FA)" icon="toggle-left" />
        <Option
          label="Biometric Authentication"
          icon="toggle-left"
          isTrailing
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
        Delete address
      </Button>
    </View>
  );
}
