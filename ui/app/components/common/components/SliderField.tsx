import { View, Text } from "react-native";
import Slider from "@react-native-community/slider";
import { styles } from "../styles/SliderField.styles";
import { InfoButton } from "./InfoButton";

interface SliderFieldProps {
  label: string;
  value: number;
  onValueChange: (value: number) => void;
  minimumValue?: number;
  maximumValue?: number;
  step?: number;
  showValue?: boolean;
  unit?: string;
  info?: string;
}

export const SliderField = ({
  label,
  value,
  onValueChange,
  minimumValue = 0,
  maximumValue = 100,
  step = 1,
  showValue = true,
  unit = "%",
  info
}: SliderFieldProps) => {
  return (
    <View style={styles.sliderRow}>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>{label}</Text>
        {info && <InfoButton title={label} message={info} />}
      </View>
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
