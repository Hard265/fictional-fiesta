import { Feather } from '@expo/vector-icons';
import { useColorScheme } from 'nativewind';
import React from 'react';
import { Text, View, Pressable } from 'react-native';
import theme from '../misc/theme';

interface OptionsProps {
    title: string;
    children: React.ReactNode
}

interface OptionProps {
    label: string,
    icon: string,
    isTrailing?: boolean,
    onTap?: () => void
}

export function Options({ title, children }: OptionsProps) {
    return <>
        <View className="my-0.5">
            <Text className="text-start dark:text-white font-medium p-1 capitalize">{title}</Text>
            <View className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                {children}
            </View>
        </View>
    </>
}


export function Option({ label, icon, isTrailing = false, onTap }: OptionProps) {
    const { colorScheme } = useColorScheme()
    return <>
        <Pressable onPress={onTap} className={"flex flex-row px-4 py-2.5 justify-between " + (!isTrailing && 'border-b border-gray-300 dark:border-gray-700')}>
            <Text className="dark:text-white font-medium capitalize">{label}</Text>
            {/**@ts-ignore */}
            <Feather name={icon} size={20} color={theme[colorScheme].tint} />
        </Pressable>
    </>
}