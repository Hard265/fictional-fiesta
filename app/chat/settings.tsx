import { Pressable, View } from "react-native";
import { Text } from "../../components/Text";
import { Option, Options } from "../../components/Options";

export default function Page() {
    return (
        <View className="flex-1 justify-end p-4 dark:bg-black">
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
                <Option
                    label="Two-Factor Authentication (2FA)"
                    icon="toggle-left"
                />
                <Option
                    label="Biometric Authentication"
                    icon="toggle-left"
                    isTrailing
                />
            </Options>
            <Pressable className="flex flex-row justify-center w-full p-3 bg-red-500 mt-4 rounded-lg items-center">
                <Text className="text-white text-base font-medium">
                    Delete account
                </Text>
            </Pressable>
        </View>
    )
}