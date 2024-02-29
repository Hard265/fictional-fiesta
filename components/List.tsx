import { FlatList, Pressable } from "react-native";
import { Text } from "./Text";
import { PressableProps } from "react-native/Libraries/Components/Pressable/Pressable";
import { TextProps } from "react-native/Libraries/Text/Text";


export function List({
  data,
}: {
  data: { id: string; title: string; subtitle: string }[];
}) {
  return (
    <FlatList
      data={data}
      renderItem={({ item }) => (
        <ListItem>
          <ListItemTitle>{item.title}</ListItemTitle>
          <ListItemSubtitle>{item.subtitle}</ListItemSubtitle>
        </ListItem>
      )}
      keyExtractor={(item) => item.id}
    />
  );
}
interface ListItemProps extends PressableProps {}


export function ListItem({ children, ...props }: ListItemProps) {
  return (
    <Pressable className="flex gap-4 px-4 py-2" {...props}>
      {children}
    </Pressable>
  );
}

export function ListItemTitle({ children, ...props }: TextProps) {
  return (
    <Text
      className="text-lg font-semibold"
      numberOfLines={1}
      ellipsizeMode="tail"
      {...props}
    >
      {children}
    </Text>
  );
}

export function ListItemSubtitle({ children, ...props }: TextProps) {
  return (
    <Text className="text-sm" numberOfLines={1} ellipsizeMode="tail" {...props}>
      {children}
    </Text>
  );
}
