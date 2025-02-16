import { StyleSheet } from "react-native";

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
  },
  slider: {
    flex: 1,
    marginHorizontal: 10,
  },
});
