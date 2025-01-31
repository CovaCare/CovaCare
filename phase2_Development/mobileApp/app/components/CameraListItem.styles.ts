import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  cameraItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    backgroundColor: "#F9F9F9",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cameraName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  cameraDetails: {
    fontSize: 14,
    color: "#666",
  },
  deleteButton: {
    backgroundColor: "#ff5252",
    padding: 8,
    borderRadius: 4,
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 14,
  },
});
