import { StyleSheet } from "react-native";
import colors from "../../../../constants/colors";

export const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: 4,
    flexDirection: "row",
  },
  checkboxContainer: {
    padding: 4,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  checked: {
    backgroundColor: colors.primary,
  },
  checkmark: {
    color: colors.text.light,
    fontSize: 14,
    fontWeight: "bold",
  },
  label: {
    fontSize: 14,
    color: colors.text.primary,
    fontWeight: "500",
  },
});
