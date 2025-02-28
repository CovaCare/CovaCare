import { TouchableOpacity, Text } from "react-native";
import { styles } from "../styles/AddButton.styles";

interface AddButtonProps {
  title: string;
  onPress: () => void;
}

export const AddButton = ({ title, onPress }: AddButtonProps) => {
  return (
    <TouchableOpacity style={styles.addButton} onPress={onPress}>
      <Text style={styles.addButtonText}>{title}</Text>
    </TouchableOpacity>
  );
}; 