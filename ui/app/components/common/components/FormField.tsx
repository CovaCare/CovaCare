import { Text, TextInput, View, TouchableOpacity, Keyboard, InputAccessoryView, Platform } from "react-native";
import { styles } from "../styles/FormField.styles";
import { InfoButton } from "./InfoButton";

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
  infoButtonTitle?: string;
  infoButtonMessage?: string;
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
  style,
  infoButtonTitle,
  infoButtonMessage
}: FormFieldProps) => {
  const inputAccessoryViewID = 'numericKeyboard';

  return (
    <View>
      <View style={styles.labelContainer}>
        <Text style={styles.fieldTitle}>{label}</Text>
        {infoButtonTitle && infoButtonMessage && (
          <InfoButton title={infoButtonTitle} message={infoButtonMessage} />
        )}
      </View>
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
