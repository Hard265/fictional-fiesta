import { Text as DefaultText } from "react-native";
import { TextProps } from "react-native/Libraries/Text/Text";

export function Text({ children, ...props }: TextProps) {
  return (
    <DefaultText
      className="text-black dark:text-white"
      style={{ fontFamily: "Inter_500Medium" }}
      {...props}
    >
      {children}
    </DefaultText>
  );
}

export function Heading({ children, ...props }: TextProps) {
  return (
    <Text
      className="text-black dark:text-white text-lg"
      style={{ fontFamily: "Inter_700Bold" }}
      {...props}
    >
      {children}
    </Text>
  );
}
export function SubHeading({ children, ...props }: TextProps) {
  return (
    <Text
      className="text-black dark:text-white text-base"
      style={{ fontFamily: "Inter_600SemiBold" }}
      {...props}
    >
      {children}
    </Text>
  );
}
