import { View, TouchableOpacity, Text, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { styles } from "../styles/BaseForm.styles";

interface BaseFormProps {
  title: string;
  onSave: () => void;
  onCancel: () => void;
  children: React.ReactNode;
  scrollable?: boolean;
}

export const BaseForm = ({ 
  title, 
  onSave, 
  onCancel, 
  children,
  scrollable = true 
}: BaseFormProps) => {
  const ContentWrapper = scrollable ? ScrollView : View;

  return (
    <KeyboardAvoidingView 
      style={styles.outerContainer}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
    >
      <View style={styles.headerContainer}>
        <Text style={styles.formTitle}>{title}</Text>
      </View>

      <ContentWrapper 
        contentContainerStyle={scrollable ? styles.scrollContainer : styles.container}
      >
        {children}
      </ContentWrapper>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton} onPress={onSave}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};