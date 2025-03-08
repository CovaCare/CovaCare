import { TouchableOpacity, Text, View, StyleProp, ViewStyle } from "react-native";
import { styles } from "../styles/Checkbox.styles";

interface CheckboxProps {
  label: string;
  checked: boolean;
  onValueChange: (value: boolean) => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export const Checkbox = ({ label, checked, onValueChange, style, testID }: CheckboxProps) => {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity 
        style={styles.checkboxContainer} 
        onPress={() => onValueChange(!checked)}
        testID={testID}
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