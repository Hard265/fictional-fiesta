import React from "react";
import { Pressable } from "react-native";
import { PressableProps } from "react-native/Libraries/Components/Pressable/Pressable";
import { Heading } from "./Text";

type variants = "outlined" | "filled";

//interface extend PressableProps
interface ButtonProps extends PressableProps {
  children: React.ReactNode;
  color?:
    | "red"
    | "orange"
    | "amber"
    | "yellow"
    | "lime"
    | "green"
    | "emerald"
    | "teal"
    | "cyan"
    | "sky"
    | "blue"
    | "indigo"
    | "violet"
    | "purple"
    | "fuchsia"
    | "pink"
    | "rose"
    | "stone"
    | "neutral"
    | "zinc"
    | "gray"
    | "slate";
  onPress: () => void;
  variant?: variants;
}

export default function Button({
  children,
  color = "gray",
  variant = "outlined",
  ...props
}: ButtonProps) {
  return (
    <Pressable
      className={`border border-${color}-800 bg-${color}-900 dark:border-${color}-100 dark:bg-${color}-50 flex flex-row justify-center w-full p-4 rounded-lg items-center`}
      {...props}
    >
      <Heading
        className={`text-sm text-${color}-100 dark:text-${color}-900`}
        ellipsizeMode="tail"
        numberOfLines={1}
      >
        {children}
      </Heading>
    </Pressable>
  );
}
