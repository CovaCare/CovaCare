import { StyleSheet } from "react-native";
import colors from "../../../../constants/colors";

export const styles = StyleSheet.create({
  addButton: {
    margin: 16,
    padding: 16,
    backgroundColor: colors.primary,
    borderRadius: 8,
    alignItems: "center",
  },
  addButtonText: {
    color: colors.text.light,
    fontSize: 16,
    fontWeight: "bold",
  },
}); 