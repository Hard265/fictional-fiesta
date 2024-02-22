import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { View, Text, Button, TextInput, FlatList, TouchableOpacity, Pressable, Modal, StyleSheet } from 'react-native';
import { generateMnemonic } from '../utils/cryptography';
import Prompt, { PromptActions } from '../components/Prompt';

interface PageProps {
    // Define props here if needed
}

export default function Page(props: PageProps) {
    const [confirmSeed, setConfirmSeed] = useState(false);
    const [mnemonic, setMnemonic] = useState<string[]>([]);

    useEffect(() => {
        setMnemonic(generateMnemonic().trim().split(' '))
    }, [])

    // Function to generate a random seed phrase
    const warningText = " Your mnemonic seed phrase is a series of words that can be used to recover your account if you lose access to your device. It's crucial to keep this seed phrase secure and never share it with anyone. Write down your seed phrase on a piece of paper and store it in a safe place. Do not store it digitally or take a screenshot."

    function handleContinue(): void {
        setConfirmSeed(true);
    }

    function handleSuccess(): void {
        router.replace('/chat');
    }

    return (
        <View className='flex-1 flex items-center justify-center p-4 dark:bg-gray-900'>
            <View className='container rounded-xl p-4 mb-8 mt-auto flex flex-row gap-x-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-800'>
                <Feather style={{ marginTop: 4 }} name="key" size={24} color="black" />
                <Text className='flex-1 mb-2 text-gray-600 dark:text-gray-100'>
                    <Text className='font-semibold'>Warning:</Text>
                    {warningText}
                </Text>
            </View>
            <View className="flex flex-row flex-wrap w-full gap-1 justify-center">
                {mnemonic
                    .map((item: string, index: number) => (
                        <View key={index} className='inline-flex flex-row gap-x-2 p-2 rounded-xl border border-gray-300 dark:border-gray-700 dark:bg-gray-800'>
                            <Text className='text-sm text-gray-300 dark:text-gray-500'>{index + 1}</Text>
                            <Text className='font-semibold text-gray-900 dark:text-gray-100'>{item}</Text>
                        </View>
                    ))}
            </View>

            <Pressable onPress={() => handleContinue()} className='w-full items-center justify-center p-3 rounded-xl mt-auto bg-gray-800 dark:bg-white'>
                <Text className='text-white font-medium dark:text-gray-800'>Continue</Text>
            </Pressable>
            {confirmSeed && <>
                <Prompt title='confirm backup' onRequestClose={() => setConfirmSeed(false)}>
                    <View className='mx-1'>
                        <Text className='text-gray-900 dark:text-white mb-2'>Please enter the mnemonic seed phrase to continue</Text>
                        <TextInput
                            secureTextEntry
                            placeholder='Word1 Word2 Word3...'
                            placeholderTextColor={'gray'}
                            multiline numberOfLines={1}
                            className='w-full p-2.5 text-gray-900 dark:text-white text-sm rounded-lg bg-gray-200 border border-gray-300 dark:border-gray-700 dark:focus:border-gray-500 dark:bg-gray-900 '
                        />
                    </View>
                    <PromptActions>
                        <Pressable className="p-2.5 flex-1 dark:bg-white items-center justify-center rounded-lg" onPress={handleSuccess}>
                            <Text className="text-gray-900 dark:text-gray-900 font-semibold capitalize">confirm</Text>
                        </Pressable>
                    </PromptActions>
                </Prompt>
            </>}
            <StatusBar style="auto" />
        </View>
    );
}

