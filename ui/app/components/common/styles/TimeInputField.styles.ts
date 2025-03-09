import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: 600,
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "70%",
  },
  settingsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    height: 40,
    paddingLeft: 4,
    paddingRight: 4,
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 4,
  },
});
