import { Feather } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { User } from "../types/auth";
import { router } from "expo-router";
import theme from "../misc/theme";
import { useColorScheme } from "nativewind";
import { useSQLiteContext } from "expo-sqlite/next";
import _ from "lodash";
import { _isComputed } from "mobx/dist/internal";

export default function Users({
  onRequestClose,
}: {
  onRequestClose: () => void;
}) {
  const { colorScheme } = useColorScheme();
  const db = useSQLiteContext();

  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [selection, setSelection] = useState<string[]>([]);

  useEffect(() => {
    async function setup() {
      const results = (await db.getAllAsync("SELECT * FROM users")) as User[];
      setUsers(results);
    }
    setup();
  }, []);

  const searchResults = () => {
    return users.filter((user) =>
      (user.displayName || user.address)
        .toLocaleLowerCase()
        .includes(search.toLocaleLowerCase())
    );
  };

  const handleLongPress = (address: string) => {
    setSelection(_.xor(selection, [address]));
  };

  const handlePress = (address: string) => {
    if (!_.isEmpty(selection)) {
      setSelection(_.xor(selection, [address]));
      return;
    }
  };

  const handlePressDelete = async () => {
    for (const address of selection) {
      await db.runAsync("DELETE FROM users WHERE address = ?", address);
    }
    _.filter(users, (user) => !_.includes(selection, user.address));
    setSelection([]);
  };

  return (
    <Modal
      animationType="slide"
      transparent
      statusBarTranslucent
      onRequestClose={onRequestClose}
    >
      <Pressable style={StyleSheet.absoluteFill} className="bg-black/75" />
      <View className="flex-1 flex flex-col items-center justify-center mt-8 rounded-t-xl bg-white dark:bg-gray-800">
        <View className="w-full flex flex-row items-center justify-between p-4 border-b border-gray-300 dark:border-gray-700">
          <Text className="text-lg font-semibold dark:text-white">
            Contacts
          </Text>
          <Feather
            name="x"
            size={24}
            color={theme[colorScheme].tint}
            onPress={onRequestClose}
          />
        </View>
        <FlatList
          className="flex-1 w-full"
          data={search ? searchResults() : users}
          snapToEnd
          renderItem={({ item }: { item: User }) => {
            return (
              <Pressable
                onPress={() => handlePress(item.address)}
                onLongPress={() => handleLongPress(item.address)}
                className="flex flex-row items-center gap-4 px-4 py-1.5"
              >
                <View className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                  <Text className="font-medium text-gray-600 dark:text-gray-300 uppercase">
                    {(item.displayName || item.address).substring(0, 2)}
                  </Text>
                </View>
                <View className="flex-1">
                  <Text className="text-[16px] font-medium text-gray-900 truncate dark:text-white">
                    {item.displayName}
                  </Text>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode="middle"
                    className="text-sm text-gray-500 truncate dark:text-gray-400"
                  >
                    {item.address}
                  </Text>
                </View>
                {!_.isEmpty(selection) && (
                  <Feather
                    name={
                      _.includes(selection, item.address)
                        ? "check-square"
                        : "square"
                    }
                    size={20}
                    color={theme[colorScheme].tint}
                  />
                )}
              </Pressable>
            );
          }}
          ListEmptyComponent={emptyListComponent(!!search.length)}
          keyExtractor={(item) => item.address}
        />
        <View className="w-full flex flex-row items-center justify-between p-4 gap-x-4">
          <TextInput
            value={search}
            onChangeText={setSearch}
            className="flex-1 rounded-lg p-2 placeholder:text-white border border-gray-300 focus:border-gray-400 bg-gray-200 dark:border-gray-700  dark:focus:boder-gray-600 dark:bg-gray-900"
            placeholder="Find"
            placeholderTextColor={"gray"}
            returnKeyType="search"
          />
          {_.isEmpty(selection) ? (
            <Pressable className="p-3 rounded-lg bg-gray-900 dark:bg-gray-50">
              <Feather
                name="user-plus"
                size={20}
                color={theme[colorScheme].bg}
              />
            </Pressable>
          ) : (
            <Pressable
              className="p-3 rounded-lg bg-red-600 dark:bg-red-500"
              onPress={handlePressDelete}
            >
              <Feather name="trash" size={20} color={"white"} />
            </Pressable>
          )}
        </View>
      </View>
    </Modal>
  );
}

function emptyListComponent(isSearching: boolean) {
  return isSearching ? (
    <>
      <Text className="text-center text-gray-500">No results found</Text>
    </>
  ) : (
    <>
      <Text className="text-center text-gray-500">No saved contacts found</Text>
    </>
  );
}
