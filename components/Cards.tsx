import { List } from "react-native-paper";
import { User } from "../types/auth";

interface ListItemCardProps {
  title: string;
  description?: string;
  onPress?: () => void;
}

function ListItemCard({ title, description, ...props }: ListItemCardProps) {
  return <List.Item title={title} description={description} {...props} />;
}

interface UserCardProps {
  user: User;
  onPress: () => void;
}

export function UserCard({ user, ...props }: UserCardProps) {
  return (
    <ListItemCard
      title={user.displayName || user.address}
      description={user.displayName ?? user.address}
      {...props}
    />
  );
}
