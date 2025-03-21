import { StyleSheet } from "react-native";
import colors from "../../../../constants/colors";

export const styles = StyleSheet.create({
  dateTimePicker: {
    marginLeft: -10,
  },
  pickerContainer: {
    backgroundColor: colors.background.secondary,
    borderRadius: 8,
  },
  pickerText: {
    color: colors.text.primary,
    fontSize: 16,
  },
});
