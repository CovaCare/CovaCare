import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { styles } from "../styles/TimePicker.styles";

interface TimePickerProps {
  value: string;
  onChange: (time: string) => void;
}

export const TimePicker = ({ value, onChange }: TimePickerProps) => {
  const handleChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (event.type === "set" && selectedDate) {
      const hours = selectedDate.getHours().toString().padStart(2, "0");
      const minutes = selectedDate.getMinutes().toString().padStart(2, "0");
      onChange(`${hours}:${minutes}`);
    }
  };

  const getTimeDate = () => {
    value = "14:30";
    if (!value) return new Date();
    const [hours, minutes] = value.split(":");
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date;
  };

  return (
    <DateTimePicker
      testID="dateTimePicker"
      value={getTimeDate()}
      mode="time"
      is24Hour={true}
      onChange={handleChange}
      style={styles.dateTimePicker}
    />
  );
};
