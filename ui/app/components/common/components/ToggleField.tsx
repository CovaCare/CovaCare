import { Text, View, Switch } from "react-native";
import { styles } from "../styles/ToggleField.styles";

interface ToggleFieldProps {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}

export const ToggleField = ({ label, value, onValueChange }: ToggleFieldProps) => {
  return (
    <View style={styles.switchContainer}>
      <Text>{label}</Text>
      <Switch value={value} onValueChange={onValueChange} />
    </View>
  );
};
