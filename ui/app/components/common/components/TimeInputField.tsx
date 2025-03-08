import { View, Text } from "react-native";
import { TimePicker } from "./TimePicker";
import { Checkbox } from "./Checkbox";
import { styles } from "../styles/TimeInputField.styles";

interface TimeInputFieldProps {
  startTime: string;
  endTime: string;
  onStartTimeChange: (time: string) => void;
  onEndTimeChange: (time: string) => void;
  label: string;
  testIDPrefix?: string;
}

export const TimeInputField = ({
  startTime,
  endTime,
  onStartTimeChange,
  onEndTimeChange,
  label,
  testIDPrefix
}: TimeInputFieldProps) => {
  const handleAllDayToggle = (value: boolean) => {
    if (value) {
      onStartTimeChange("00:00");
      onEndTimeChange("23:59");
    } else {
      onStartTimeChange("");
      onEndTimeChange("");
    }
  };

  const isAllDay = startTime === "00:00" && endTime === "23:59";

  return (
    <View>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.timeRow}>
        <View style={styles.timePickerContainer}>
          <TimePicker
            label="Start Time"
            value={startTime}
            onChange={onStartTimeChange}
            placeholder="Start time"
            testID={testIDPrefix ? `${testIDPrefix}-start-time` : undefined}
          />
        </View>
        <View style={styles.timePickerContainer}>
          <TimePicker
            label="End Time"
            value={endTime}
            onChange={onEndTimeChange}
            placeholder="End time"
            testID={testIDPrefix ? `${testIDPrefix}-end-time` : undefined}
          />
        </View>
        <View style={styles.timePickerContainer}>
          <Checkbox
            label="All Day"
            checked={isAllDay}
            onValueChange={handleAllDayToggle}
            style={styles.allDayCheckbox}
            testID={testIDPrefix ? `${testIDPrefix}-all-day` : undefined}
          />
        </View>
      </View>
    </View>
  );
};
