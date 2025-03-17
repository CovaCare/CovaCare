import { StyleSheet } from "react-native";
import colors from "../../../../constants/colors";

export const styles = StyleSheet.create({
  fieldTitle: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 7,
    color: colors.text.primary,
  },
  input: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    backgroundColor: colors.background.secondary,
    color: colors.text.primary,
  },
  inputError: {
    borderColor: colors.status.error,
  },
});
