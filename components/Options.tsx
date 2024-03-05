import { Feather } from '@expo/vector-icons';
import { useColorScheme } from 'nativewind';
import React from 'react';
import { View, Pressable } from 'react-native';
import theme from '../misc/theme';
import { TextMedium, TextSemiBold } from './Text';

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
            <TextSemiBold className="text-start text-base dark:text-white p-1 capitalize">{title}</TextSemiBold>
            <View className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                {children}
            </View>
        </View>
    </>
}


export function Option({ label, icon, isTrailing = false, onTap }: OptionProps) {
    const { colorScheme } = useColorScheme()
    return <>
        <Pressable onPress={onTap} className={"flex flex-row px-4 py-3 justify-between " + (!isTrailing && 'border-b border-gray-300 dark:border-gray-700')}>
            <TextMedium className="dark:text-white capitalize">{label}</TextMedium>
            {/**@ts-ignore */}
            <Feather name={icon} size={20} color={theme[colorScheme].tint} />
        </Pressable>
    </>
}