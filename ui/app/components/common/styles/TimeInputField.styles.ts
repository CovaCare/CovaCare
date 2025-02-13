import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 8,
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },
  timePickerContainer: {
    flex: 1,
  },
  timeInput: {
    flex: 0.45,
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    padding: 8,
  },
  endTimeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  allDayCheckbox: {
    flex: 1,
  }
});
