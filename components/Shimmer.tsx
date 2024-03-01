
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withRepeat,
} from 'react-native-reanimated';
import { ViewProps } from 'react-native/Libraries/Components/View/ViewPropTypes';

export default function Shimmer({ ...props }: ViewProps) {
    const offset = useSharedValue(-300);

    const animatedStyles = useAnimatedStyle(() => ({
        transform: [{ translateX: offset.value }],
    }));

    React.useEffect(() => {
        offset.value = withRepeat(
            withTiming(300, { duration: 2500 }),
            -1,
        );
    }, []);

    return (
        <View className='overflow-hidden' {...props}>
            <Animated.View className='flex h-[100%] w-[100%]' style={[animatedStyles]}>
                <LinearGradient
                    className="flex-1"
                    colors={['transparent', 'rgba(107, 114, 128, 0.3)', 'transparent']}
                    start={{ x: 0, y: 1 }}
                    locations={[.1 ,0.5, 0.9,]}
                />
            </Animated.View>
        </View>
    );
}