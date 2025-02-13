import { TouchableOpacity, Text, View } from "react-native";
import { styles } from "../styles/Checkbox.styles";

interface CheckboxProps {
  label: string;
  checked: boolean;
  onValueChange: (value: boolean) => void;
  style?: object;
}

export const Checkbox = ({ label, checked, onValueChange, style }: CheckboxProps) => {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity 
        style={styles.checkboxContainer} 
        onPress={() => onValueChange(!checked)}
      >
        <View style={[styles.checkbox, checked && styles.checked]}>
          {checked && (
            <Text style={styles.checkmark}>✓</Text>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
}; 