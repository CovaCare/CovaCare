import { StyleSheet } from "react-native";
import colors from "../../../../constants/colors";

export const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
  },
  headerContainer: {
    padding: 16,
    backgroundColor: colors.background.secondary,
    borderBottomWidth: 1,
    borderBottomColor: "#DADADA",
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingBottom: 120,
  },
  container: {
    padding: 16,
  },
  formTitle: {
    marginTop: 48,
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: colors.text.primary,
  },
  buttonContainer: {
    position: "absolute",
    backgroundColor: colors.background.secondary,
    bottom: 0,
    paddingBottom: 25,
    paddingTop: 16,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cancelButton: {
    backgroundColor: colors.background.secondary,
    borderWidth: 2,
    borderColor: colors.secondary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
    alignItems: "center",
  },
  cancelButtonText: {
    color: colors.secondary,
    fontWeight: "bold",
  },
  saveButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    alignItems: "center",
  },
  saveButtonText: {
    color: colors.text.light,
    fontWeight: "bold",
  },
});
