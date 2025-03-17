import { Text, TextInput, View, TouchableOpacity, Keyboard, InputAccessoryView, Platform } from "react-native";
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
  const inputAccessoryViewID = 'numericKeyboard';

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
        inputAccessoryViewID={keyboardType === "numeric" ? inputAccessoryViewID : undefined}
      />
      {Platform.OS === 'ios' && keyboardType === "numeric" && (
        <InputAccessoryView nativeID={inputAccessoryViewID}>
          <View style={styles.keyboardAccessory}>
            <TouchableOpacity 
              style={styles.keyboardButton} 
              onPress={() => {
                Keyboard.dismiss(); 
              }}
            >
              <Text style={styles.saveButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </InputAccessoryView>
      )}
    </View>
  );
};
