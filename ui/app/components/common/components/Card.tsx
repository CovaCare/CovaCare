import { View, Text } from "react-native";
import { styles } from "../styles/Card.styles";

interface CardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export const Card = ({ title, description, children }: CardProps) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {description && <Text style={styles.description}>{description}</Text>}
      </View>
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
};
