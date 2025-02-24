import { useState } from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { styles } from '../styles/TimePicker.styles';

interface TimePickerProps {
  label: string;
  value: string;
  onChange: (time: string) => void;
  placeholder?: string;
}

export const TimePicker = ({ label, value, onChange, placeholder = "Select time" }: TimePickerProps) => {
  const [show, setShow] = useState(false);
  
  const displayTime = value || placeholder;
  
  const handleChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShow(Platform.OS === 'ios');
    if (event.type === 'set' && selectedDate) {
      const hours = selectedDate.getHours().toString().padStart(2, '0');
      const minutes = selectedDate.getMinutes().toString().padStart(2, '0');
      onChange(`${hours}:${minutes}`);
    }
  };

  const showTimePicker = () => {
    setShow(true);
  };

  const getTimeDate = () => {
    if (!value) return new Date();
    const [hours, minutes] = value.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity onPress={showTimePicker} style={styles.timeButton}>
        <Text style={styles.timeText}>{displayTime}</Text>
      </TouchableOpacity>
      {show && (
        <DateTimePicker
          value={getTimeDate()}
          mode="time"
          is24Hour={true}
          onChange={handleChange}
        />
      )}
    </View>
  );
};
