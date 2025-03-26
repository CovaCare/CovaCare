import { Text, View, Switch } from "react-native";
import { styles } from "../styles/ToggleField.styles";
import { InfoButton } from "./InfoButton";
import colors from "../../../../constants/colors";

interface ToggleFieldProps {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  testID?: string;
  spaceBetween?: boolean;
  infoButtonMessage?: string;
  infoButtonTitle?: string;
}

export const ToggleField = ({
  label,
  value,
  onValueChange,
  testID,
  spaceBetween,
  infoButtonMessage,
  infoButtonTitle,
}: ToggleFieldProps) => {
  return (
    <View
      style={
        spaceBetween
          ? styles.switchContainerSpaceBetween
          : styles.switchContainerGap
      }
    >
      {infoButtonMessage || infoButtonTitle ? (
        <View style={styles.infoButtonLabelContainer}>
          <Text style={styles.label}>{label}</Text>
          <InfoButton
            title={infoButtonTitle ?? ""}
            message={infoButtonMessage ?? ""}
          />
        </View>
      ) : (
        <Text style={styles.label}>{label}</Text>
      )}
      <Switch
        value={value}
        onValueChange={onValueChange}
        testID={testID}
        trackColor={{ false: colors.status.disabled, true: colors.primary }}
      />
    </View>
  );
};
