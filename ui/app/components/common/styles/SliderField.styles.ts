import { StyleSheet } from "react-native";
import colors from "../../../../constants/colors";

export const styles = StyleSheet.create({
  sliderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    minWidth: 100,
  },
  label: {
    marginRight: 4,
    fontSize: 14,
    fontWeight: "bold",
    color: colors.text.primary,
  },
  slider: {
    flex: 1,
    marginHorizontal: 10,
  },
  valueText: {
    color: colors.text.secondary,
    fontSize: 14,
  },
});
