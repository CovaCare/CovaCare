import { View, Text } from "react-native";
import { FormField } from "./FormField";
import { styles } from "../styles/TimeInputField.styles";

interface TimeInputFieldProps {
  startTime: string;
  endTime: string;
  onStartTimeChange: (time: string) => void;
  onEndTimeChange: (time: string) => void;
  label: string;
}

export const TimeInputField = ({
  startTime,
  endTime,
  onStartTimeChange,
  onEndTimeChange,
  label
}: TimeInputFieldProps) => {
  return (
    <View style={styles.timeRow}>
      <Text style={styles.label}>{label}</Text>
      <FormField
        label="Start Time"
        value={startTime}
        onChangeText={onStartTimeChange}
        placeholder="HH:MM"
        style={styles.timeInput}
      />
      <FormField
        label="End Time"
        value={endTime}
        onChangeText={onEndTimeChange}
        placeholder="HH:MM"
        style={styles.timeInput}
      />
    </View>
  );
};
