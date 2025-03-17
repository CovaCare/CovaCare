import { StyleSheet } from "react-native";
import colors from "../../../../constants/colors";

export const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background.secondary,
    borderRadius: 8,
    marginTop: 16,
    padding: 16,
    shadowColor: colors.shadow.default,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.text.primary,
  },
  description: {
    fontSize: 14,
    color: colors.text.secondary,
    marginTop: 4,
  },
  content: {
    gap: 16,
  },
});
