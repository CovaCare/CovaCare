import { StyleSheet } from "react-native";
import colors from "../../../../constants/colors";

export const styles = StyleSheet.create({
  fieldTitle: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 5,
    color: colors.text.primary,
  },
  input: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    padding: 12,
    marginBottom: 7,
    backgroundColor: colors.background.secondary,
    color: colors.text.primary,
  },
  inputError: {
    borderColor: colors.status.error,
  },
  keyboardAccessory: {
    backgroundColor: colors.background.secondary,
    borderTopWidth: 1,
    borderTopColor: "#DDD",
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  keyboardButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  saveButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "600",
  },
  labelContainer: {
    flexDirection: "row",
  },
  eyeButton: {
    position: 'absolute',
    right: 10,
    top: 35,
  },
});
