
import { View } from "react-native";
import Shimmer from "./Shimmer";

export default function InboxShimmer() {

    return (
        <View className='relative w-full flex-1 flex flex-col justify-end bg-transparent p-4'>
            <Shimmer className="rounded-lg self-center bg-gray-300 dark:bg-gray-900 my-0.5 w-[40%] h-6" />
            <Shimmer className="rounded-lg self-start bg-gray-300 dark:bg-gray-900 my-0.5 w-[80%] h-12" />
            <Shimmer className="rounded-lg self-end  bg-gray-300 dark:bg-gray-800 my-0.5 w-[40%] h-24" />
            <Shimmer className="rounded-lg self-end bg-gray-300 dark:bg-gray-800 my-0.5 w-[80%] h-12" />
        </View>
    )
}