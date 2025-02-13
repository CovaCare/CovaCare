import { View, Text } from "react-native";
import Slider from "@react-native-community/slider";
import { styles } from "../styles/SliderField.styles";

interface SliderFieldProps {
  label: string;
  value: number;
  onValueChange: (value: number) => void;
  minimumValue?: number;
  maximumValue?: number;
  step?: number;
  showValue?: boolean;
  unit?: string;
}

export const SliderField = ({
  label,
  value,
  onValueChange,
  minimumValue = 0,
  maximumValue = 100,
  step = 1,
  showValue = true,
  unit = "%"
}: SliderFieldProps) => {
  return (
    <View style={styles.sliderRow}>
      <Text style={styles.label}>{label}</Text>
      <Slider
        style={styles.slider}
        minimumValue={minimumValue}
        maximumValue={maximumValue}
        step={step}
        value={value}
        onValueChange={onValueChange}
      />
      {showValue && <Text>{value}{unit}</Text>}
    </View>
  );
};
