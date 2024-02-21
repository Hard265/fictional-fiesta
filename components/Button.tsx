import { useColorScheme } from "nativewind";
import React from "react";
import { ColorSchemeName, Pressable, Text } from "react-native";

type variants = 'tonal' | 'filled'

type Btn = {
    [key in variants]: {
        [key in 'light' | 'dark']: {
            [key in 'container' | 'text']: number;
        };
    };
};

interface BtnProps {
    children: React.ReactNode;
    color: string;
    variant: variants;
    className: string;
    onPress: () => void
}

const Btns: Btn = {
    filled: {
        light: {
            container: 800,
            text: 50
        },
        dark: {
            container: 50,
            text: 900
        }
    },
    tonal: {
        light: {
            container: 500,
            text: 900
        },
        dark: {
            container: 600,
            text: 50
        }
    }
}

export default function Button({ children, color, className, variant, onPress }: BtnProps) {
    const { colorScheme } = useColorScheme()

    const container = `bg-${color}-${Btns[variant][colorScheme].container}`;
    const text = `text-${color}-${Btns[variant][colorScheme].text}`;


    return (
        <Pressable className={`flex flex-row justify-center w-full px-4 py-2.5 mt-4 rounded-lg items-center ${container}`}>
            <Text className={`font-medium ${text}`} ellipsizeMode="tail" numberOfLines={1} >{children}</Text>
        </Pressable>
    )
}