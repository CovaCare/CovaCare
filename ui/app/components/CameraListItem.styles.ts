import { StyleSheet } from "react-native";
import colors from "../../constants/colors";

export const styles = StyleSheet.create({
  cameraItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    backgroundColor: colors.background.secondary,
    borderRadius: 8,
    shadowColor: colors.shadow.default,
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
    color: colors.text.primary,
  },
  cameraDetails: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 8,
  },
  detectionStatus: {
    gap: 4,
  },
  statusText: {
    fontSize: 14,
    color: colors.text.primary,
  },
  enabled: {
    color: colors.primary,
    fontWeight: "500",
  },
  disabled: {
    color: colors.text.secondary,
    fontWeight: "500",
  },
});
