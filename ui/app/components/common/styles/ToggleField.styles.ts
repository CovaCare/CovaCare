import { StyleSheet } from "react-native";
import colors from "../../../../constants/colors";

export const styles = StyleSheet.create({
  switchContainerSpaceBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  switchContainerGap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.text.primary,
  },
  infoButtonLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoIcon: {
    marginLeft: 8,
    color: colors.text.secondary,
  },
});
