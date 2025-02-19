import { Text, TextInput, View } from "react-native";
import { styles } from "../styles/FormField.styles";

interface FormFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: boolean;
  secureTextEntry?: boolean;
  maxLength?: number;
  keyboardType?: "default" | "numeric";
  style?: object;
}

export const FormField = ({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  secureTextEntry,
  maxLength,
  keyboardType = "default",
  style
}: FormFieldProps) => {
  return (
    <View>
      <Text style={styles.fieldTitle}>{label}</Text>
      <TextInput
        style={[styles.input, error && styles.inputError, style]}
        placeholder={placeholder}
        placeholderTextColor="#7D7D7D"
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        maxLength={maxLength}
        keyboardType={keyboardType}
      />
    </View>
  );
};
