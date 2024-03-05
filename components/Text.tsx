import { useColorScheme } from "nativewind";
import { Text } from "react-native";
import { TextProps } from "react-native/Libraries/Text/Text";
import Colors from 'tailwindcss/colors'


interface Props extends TextProps {
  class?: string;
}


export function TextBlack({ children, style, ...props }: Props) {
  const { colorScheme } = useColorScheme();
  return <Text style={[{ fontFamily: "Inter_900Black", color: colorScheme === 'dark' ? Colors.gray[50] : Colors.gray[900], }, style]}>{children}</Text>;
}

export function TextRegular({ children, style, ...props }: Props) {
  const { colorScheme } = useColorScheme();
  return <Text style={[{ fontFamily: "Inter_400Regular", color: colorScheme === 'dark' ? Colors.gray[50] : Colors.gray[900], }, style]}>{children}</Text>;
}

export function TextSemiBold({ children, style, ...props }: Props) {
  const { colorScheme } = useColorScheme();
  return <Text style={[{ fontFamily: "Inter_600SemiBold", color: colorScheme === 'dark' ? Colors.gray[50] : Colors.gray[900], }, style]}>{children}</Text>;
}

export function TextBold({ children, style, ...props }: Props) {
  const { colorScheme } = useColorScheme();
  return <Text style={[{ fontFamily: "Inter_700Bold", color: colorScheme === 'dark' ? Colors.gray[50] : Colors.gray[900], }, style]}>{children}</Text>;
}

export function TextMedium({ children, style, ...props }: Props) {
  const { colorScheme } = useColorScheme();
  return <Text style={[{ fontFamily: "Inter_500Medium", color: colorScheme === 'dark' ? Colors.gray[50] : Colors.gray[900], }, style]}>{children}</Text>;
}

