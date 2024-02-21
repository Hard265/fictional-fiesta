import { Stack, router, useLocalSearchParams, Navigator } from "expo-router";
import { observer } from "mobx-react";
import { Pressable, Text, View } from "react-native";
import store from "../../store/store";
import { Option, Options } from "../../components/Options";
import _ from "lodash";
import Prompt from "../../components/Prompt";
import { useState } from "react";

type modals = 'deletion' | 'block' | null;

export default observer(() => {
    const { address } = useLocalSearchParams()

    const user = address ? store.getUser(address as string) : store.admin;
    const title = user?.displayName || user?.address;

    const [modal, setModal] = useState<modals>(null)

    const handleDeletion = () => {
        router.replace('/chat');
        if (user) store.deleteUser(user);
    }

    const dismissModals = () => setModal(null)

    return <View className="flex-1 justify-end p-4 dark:bg-black">
        <Stack.Screen options={{ title }} />

        {
            !address ? <>
                <Options title="theme settings">
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
                    <Option label="Biometric Authentication" icon="toggle-left" isTrailing />
                </Options>
                <Pressable className="flex flex-row justify-center w-full px-4 py-2.5 bg-red-500 mt-4 rounded-lg items-center">
                    <Text ellipsizeMode="tail" numberOfLines={1} className="text-white font-medium">Remove account</Text>
                </Pressable>
            </> : <>
                <Options title="Data Management">
                    <Option label="Export Data" icon="download-cloud" isTrailing />
                </Options>
                <Options title="Privacy Controls">
                    <Option label="Mute notifications" icon="toggle-left" />
                    <Option label="Block" icon="toggle-left" isTrailing onTap={() => setModal('block')} />
                </Options>
                <Pressable className="flex flex-row justify-center w-full px-4 py-2.5 bg-red-500 mt-4 rounded-lg items-center" onPress={() => setModal('deletion')}>
                    <Text ellipsizeMode="tail" numberOfLines={1} className="text-white font-medium">Delete <Text className="font-semibold">{user?.displayName || user?.address}</Text></Text>
                </Pressable>
            </>
        }
        {modal === 'deletion' &&
            <Prompt title="delete" onRequestClose={dismissModals}>
                <Text className="text-gray-900 dark:text-white ">Are you sure to permanently delete <Text className="font-semibold">{user?.address}?</Text></Text>
                <View className="flex flex-row gap-x-4 mt-2.5">
                    <Pressable className="p-2.5 flex-1 dark:bg-gray-700 items-center justify-center rounded-lg" onPress={dismissModals}>
                        <Text className="text-gray-900 dark:text-white font-semibold capitalize">cancel</Text>
                    </Pressable>
                    <Pressable className="p-2.5 flex-1 bg-red-600 dark:bg-red-500 items-center justify-center rounded-lg" onPress={handleDeletion}>
                        <Text className="text-white font-semibold capitalize">Delete</Text>
                    </Pressable>
                </View>
            </Prompt>
        }
        {modal === 'block' &&
            <Prompt title="Block" onRequestClose={dismissModals}>
                <Text className="text-gray-900 dark:text-white "><Text className="font-semibold">{user?.address}</Text> won't be able to message you</Text>
                <View className="flex flex-row gap-x-4 mt-2.5">
                    <Pressable className="p-2.5 flex-1 dark:bg-gray-700 items-center justify-center rounded-lg" onPress={dismissModals}>
                        <Text className="text-gray-900 dark:text-white font-semibold capitalize">cancel</Text>
                    </Pressable>
                    <Pressable className="p-2.5 flex-1 dark:bg-white items-center justify-center rounded-lg" onPress={() => null}>
                        <Text className="text-gray-900 dark:text-gray-900 font-semibold capitalize">Block</Text>
                    </Pressable>
                </View>
            </Prompt>
        }
    </View>

})


