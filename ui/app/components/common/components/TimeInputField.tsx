import { View, Text } from "react-native";
import { TimePicker } from "./TimePicker";
import { Checkbox } from "./Checkbox";
import { styles } from "../styles/TimeInputField.styles";
import { useState } from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import colors from "@/constants/colors";
import { InfoButton } from "./InfoButton";

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
  testIDPrefix,
}: TimeInputFieldProps) => {
  const [allDay, setAllDay] = useState(
    startTime == "00:00" && endTime == "00:00"
  );
  const handleAllDayToggle = (value: boolean) => {
    if (value) {
      setAllDay(true);
      onStartTimeChange("00:00");
      onEndTimeChange("00:00");
    } else {
      setAllDay(false);
      onStartTimeChange(startTime);
      onEndTimeChange(endTime);
    }
  };

  return (
    <View>
      <View style={styles.labelContainer}>
        <FontAwesome name="clock-o" size={16} color={colors.icon.primary} />
        <Text style={styles.label}>{label}</Text>
        <InfoButton
          title={"Active Hours"}
          message={
            "Select the hours during which this feature will be active. For 24/7 monitoring, choose 'All Day'. To set specific hours, define a time range below (e.g., 5:00 AM to 12:00 AM)."
          }
        />
      </View>
      <View style={styles.settingsContainer}>
        <Checkbox
          label="All Day"
          checked={allDay}
          onValueChange={handleAllDayToggle}
          testID={testIDPrefix ? `${testIDPrefix}-all-day` : undefined}
        />
        {!allDay && (
          <View style={styles.timeRow}>
            <TimePicker value={startTime} onChange={onStartTimeChange} />
            <Text>To</Text>
            <TimePicker value={endTime} onChange={onEndTimeChange} />
          </View>
        )}
      </View>
    </View>
  );
};
