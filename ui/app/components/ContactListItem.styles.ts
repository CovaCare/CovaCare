import { StyleSheet } from "react-native";
import colors from "../../constants/colors";

export const styles = StyleSheet.create({
  contactItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    backgroundColor: colors.background.secondary,
    borderRadius: 8,
    shadowColor: colors.shadow.default,
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  contactName: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text.primary,
  },
  contactPhone: {
    fontSize: 16,
    color: colors.text.secondary,
  },
  contactStatus: {
    fontSize: 14,
    color: colors.text.primary,
    marginTop: 4,
  },
  active: {
    color: colors.status.success,
    fontWeight: "500",
  },
  inactive: {
    color: colors.text.secondary,
    fontWeight: "500",
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  testButton: {
    backgroundColor: colors.primary,
    padding: 8,
    borderRadius: 4,
  },
  buttonText: {
    color: colors.text.light,
    fontSize: 14,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  phoneContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginVertical: 6,
  },
});
