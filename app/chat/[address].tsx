import { Feather } from "@expo/vector-icons";
import dayjs from 'dayjs';
import { Stack, router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import _ from "lodash";
import { useColorScheme } from "nativewind";
import React from "react";
import { Pressable, SectionList, Text, TextInput, View } from "react-native";
import theme from "../../misc/theme";
import { Message } from "../../types/chat";
import { observer } from "mobx-react";
import store from "../../store/store";

export default observer(() => {
    const { address } = useLocalSearchParams();
    const { colorScheme } = useColorScheme();
    const [input, setInput] = React.useState('')
    const inputRef = React.createRef<TextInput>()

    const user = address ? store.getUser(address as string) : store.admin;
    if (!user) return null

    const messages = _.filter(store.messages, (message) => _.includes([user, store.admin], message.sender) && _.includes([user, store.admin], message.receiver))
    const sections = _.map(
        _.groupBy(
            _.sortBy(
                messages,
                'timestamp'
            ),
            (message) => dayjs(message.timestamp).format('MMM DD, YYYY')
        ),
        (data, title) => ({ title, data })
    )
    const [selected, setSelected] = React.useState<Message[]>([])

    const toUser = () => router.push("/chat/user?address=" + user.address);

    const handleSubmit = () => {
        inputRef.current?.blur();
        store.pushMessage(store.admin, user, input)
        setInput('')
    }
    const headerTitle = _.isEmpty(selected) ? (user.displayName || user.address) : `${_.size(selected)} selected`

    return (
        <View className="flex-1 flex h-full items-center justify-center dark:bg-black">
            <Stack.Screen options={{
                title: headerTitle,
                headerLeft: _.isEmpty(selected) ? undefined : (props) => (<Feather name="x" color={props.tintColor} />),
                headerRight(props) {
                    return (
                        <Feather name="user" size={24} color={props.tintColor} onPress={toUser} />
                    )
                },
            }} />
            <SectionList
                className="flex-1 flex w-full h-full flex-col"
                sections={sections}
                renderItem={({ item }: { item: Message }) => {
                    const handlePress = () => {
                        setSelected(_.xor(selected, [item]));
                    }
                    if (_.isEqual(item.sender, store.admin)) {
                        return <>
                            <Pressable className={"w-full flex px-2 py-1 items-end " + (_.includes(selected, item) && ' bg-blue-600/75')} onPress={handlePress}>
                                <View className="max-w-[80%] leading-1.5 p-4 rounded-lg shadow-lg border border-gray-200 bg-gray-50 dark:bg-gray-100">
                                    <Text className="text-sm font-medium text-gray-900">{item.text}</Text>
                                </View>
                            </Pressable>
                        </>
                    }
                    return <>
                        <Pressable className={"w-full flex px-2 py-1 items-end " + (_.includes(selected, item) && ' bg-blue-600/75')} onPress={handlePress}>
                            <View className="max-w-[80%] leading-1.5 p-4 rounded-lg shadow-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800">
                                <Text className="text-sm font-medium text-gray-900 dark:text-white">{item.text}</Text>
                            </View>
                        </Pressable>
                    </>
                }}
                renderSectionHeader={renderSectionHeader}
                ListEmptyComponent={emptyListComponent()}
                keyExtractor={(item) => item.id}
            />

            <View className="w-full p-4 gap-x-4 flex flex-row items-end bg-white dark:bg-black">
                <TextInput
                    ref={inputRef}
                    placeholder="Aa..."
                    placeholderTextColor={'gray'}
                    value={input}
                    onChangeText={setInput}
                    className="flex-1 p-2.5 text-black dark:text-white text-sm rounded-lg bg-gray-200 border border-gray-300 focus:border-gray-400 dark:bg-gray-800 dark:border-gray-700 dark:focus:border-gray-600"
                    multiline numberOfLines={1}
                />
                <Pressable className="rounded-xl items-center justify-center p-3.5 bg-gray-900 dark:bg-gray-50" onPress={handleSubmit}>
                    <Feather name="arrow-up" size={20} color={theme[colorScheme].bg} />
                </Pressable>
            </View>

            <StatusBar style="auto" />
        </View>
    );
})

function renderSectionHeader({ section }: { section: { title: string } }) {
    return <>
        <Text className="text-center text-sm text-500 dark:text-gray-600 capitalize my-2">
            {section.title}
        </Text>
    </>
}

function emptyListComponent() {
    return <View className="flex-1 flex justify-center my-auto items-center">
        <Text className="text-gray-500 font-medium">No message</Text>
    </View>

}
