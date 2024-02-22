import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

type PromptProps = {
    title: string;
    children: React.ReactNode;
    onRequestClose?: () => void;
}

export default function Prompt({ title, children, onRequestClose }: PromptProps) {
    return (
        <Modal animationType="fade" transparent statusBarTranslucent onRequestClose={onRequestClose}>
            <Pressable style={StyleSheet.absoluteFill} className="bg-black/75" onPress={onRequestClose} />
            <View className="min-w-[280px] max-w-[520px] p-4 rounded-[24px] border border-gray-400 my-auto mx-4 dark:border-gray-700 bg-white dark:bg-gray-800">
                {title && <Text className="text-lg font-semibold text-gray-90 mb-2 dark:text-gray-100 capitalize">{title}</Text>}
                {children}
            </View>
        </Modal>
    );
}


export function PromptActions({ children }: { children: React.ReactNode, }) {
    return (
        <View className='flex flex-row gap-x-4 mt-4'>
            {children}
        </View>
    )
}