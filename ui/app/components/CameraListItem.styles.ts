import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  cameraItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    backgroundColor: "#F9F9F9",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  infoContainer: {
    flex: 1,
    marginRight: 16,
  },
  cameraName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  cameraDetails: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  detectionStatus: {
    gap: 4,
  },
  statusText: {
    fontSize: 14,
    color: "#333",
  },
  enabled: {
    color: "#4CAF50",
    fontWeight: "500",
  },
  disabled: {
    color: "#FF5252",
    fontWeight: "500",
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
