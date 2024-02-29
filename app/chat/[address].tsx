import { Feather } from "@expo/vector-icons";
import dayjs from "dayjs";
import { randomUUID } from "expo-crypto";
import { Stack, router, useLocalSearchParams } from "expo-router";
import { useSQLiteContext } from "expo-sqlite/next";
import _ from "lodash";
import { observer } from "mobx-react";
import { useColorScheme, useTailwind } from "nativewind";
import { createRef, useEffect, useState } from "react";
import { ActivityIndicator, Pressable, SectionList, Text, TextInput, View } from "react-native";
import theme from "../../misc/theme";
import store from "../../store/store";
import { User } from "../../types/auth";
import { Message } from "../../types/chat";
import { observable } from "mobx";

export default function Page() {
    const { address, displayName } = useLocalSearchParams();
    const { colorScheme } = useColorScheme();
    const db = useSQLiteContext();

    const [user, setUser] = useState<User | null>();

    const inputRef = createRef<TextInput>();
    const [input, _input] = useState("");

    const [loading, setLoading] = useState(true);
    const [messages, setMessages] = useState<Message[]>([]);
    const [selections, setSelections] = useState<string[]>([]);

    useEffect(() => {
        async function fetchMessages() {
            try {
                const [userInstance, messages] = await Promise.all([
                    db.getFirstAsync<User>(
                        "SELECT * FROM users WHERE address = ?",
                        _.toString(address)
                    ),
                    db.getAllAsync<Message>(
                        "SELECT * FROM messages WHERE (sender = ? AND receiver = ?) OR (sender = ? AND receiver = ?)",
                        [
                            address as string,
                            store.admin.address,
                            store.admin.address,
                            address as string,
                        ]
                    ),
                ]);

                setUser(userInstance || null);
                setMessages(messages);
            } catch (error) {
                console.error("Error fetching user and messages:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchMessages();
    }, []);

    const sections = _.chain(messages).sortBy("timestamp").clone().reverse().groupBy((message) => dayjs(message.timestamp).format("MMM DD, YYYY")).map((data, title) => ({ title, data })).value();

    const handleSubmit = async () => {
        const message: Message = { id: randomUUID(), sender: store.admin.address, receiver: address as string, content: input, timestamp: dayjs().toISOString(), };

        await db.runAsync(
            "INSERT INTO messages (id, sender, receiver, content, timestamp) VALUES ($id, $sender, $receiver, $content, $timestamp)",
            _.values(message)
        );
        setMessages(_.unionBy(messages, [message], "id"));
        _input("");
        inputRef.current?.blur();
    };

    const handleDeleteMessages = async () => {
        try {
            for (const id of selections) {
                await db.runAsync("DELETE FROM messages WHERE id = $id", { $id: id });
            }
        } catch (error) {

        } finally {
            setMessages(_.filter(messages, (message) => !selections.includes(message.id)));
            setSelections([]);
        }
    }

    return (
        <View className="flex-1 flex h-full items-center justify-center dark:bg-black">
            {
                loading ? (
                    <ActivityIndicator className="my-auto" size={"large"} />
                ) : (
                    <SectionList
                        inverted
                        className="flex-1 flex w-full h-full flex-col"
                        sections={sections}
                        renderItem={({ item }: { item: Message }) => {
                            const handlePress = () => {
                                if (!_.isEmpty(selections))
                                    setSelections((selections) => _.xor(selections, [item.id]))
                            };
                            const handleLongPress = () => {
                                setSelections((selections) => _.xor(selections, [item.id]))
                            };

                            const isSelected = selections.includes(item.id);

                            if (_.isEqual(item.sender, store.admin.address)) {
                                return (
                                    <>
                                        <Pressable
                                            className="w-full flex-row px-2 py-1 justify-end items-end"
                                            onPress={handlePress}
                                            onLongPress={handleLongPress}
                                        >
                                            <View className="max-w-[80%] leading-1.5 p-4 rounded-lg shadow-lg border border-gray-200 bg-gray-50 dark:bg-gray-100">
                                                <Text style={{ fontFamily: "Inter_500Medium" }} className="text-sm text-gray-900">
                                                    {item.content}
                                                </Text>
                                            </View>
                                            {
                                                isSelected && (
                                                    <Text className="dark:text-white p-1 pb-0">
                                                        <Feather name="check-square" size={20} />
                                                    </Text>
                                                )
                                            }
                                        </Pressable>
                                    </>
                                );
                            }
                            return (
                                <>
                                    <Pressable
                                        className="w-full flex px-2 py-1 justify-start"
                                        onPress={handlePress}
                                    >
                                        <View className="max-w-[80%] leading-1.5 p-4 rounded-lg shadow-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800">
                                            <Text className="text-sm font-medium text-gray-900 dark:text-white">
                                                {item.content}
                                            </Text>
                                        </View>
                                    </Pressable>
                                </>
                            );
                        }}
                        keyExtractor={(item) => item.id}
                    />
                )
            }


            <View className="w-full p-4 gap-x-4 flex flex-row items-end bg-white dark:bg-black">
                <TextInput
                    ref={inputRef}
                    placeholder="Aa..."
                    placeholderTextColor={"gray"}
                    value={input}
                    onChangeText={_input}
                    className="flex-1 p-2.5 text-black dark:text-white text-sm rounded-lg bg-gray-200 border border-gray-300 focus:border-gray-400 dark:bg-gray-800 dark:border-gray-700 dark:focus:border-gray-600"
                    multiline
                    numberOfLines={1}
                />
                <Pressable
                    className="rounded-xl items-center justify-center p-3.5 bg-gray-900 dark:bg-gray-50"
                    onPress={handleSubmit}
                >
                    <Feather name="arrow-up" size={20} color={theme[colorScheme].bg} />
                </Pressable>
            </View>

            <Stack.Screen
                options={{
                    title: (displayName || address || "") as string,
                    headerRight(props) {
                        return _.isEmpty(selections) ? (
                            <Feather name="user" size={24} color={props.tintColor} onPress={() => router.push(`chat/user?address=${address}`)} />) : (
                            <Feather name="trash" size={24} color={props.tintColor} onPress={handleDeleteMessages} />
                        )
                    }
                }
                }
            />
        </View>
    );
}

function renderSectionHeader({ section }: { section: { title: string } }) {
    return (
        <>
            <Text className="text-center text-sm text-gray-500 dark:text-gray-600 capitalize my-2">
                {section.title}
            </Text>
        </>
    );
}

function emptyListComponent() {
    return (
        <View className="flex-1 flex justify-center my-auto items-center">
            <Text className="text-gray-500 font-medium">No message</Text>
        </View>
    );
}
