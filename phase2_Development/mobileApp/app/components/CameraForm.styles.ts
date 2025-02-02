import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
  },
  headerContainer: {
    padding: 16,
    backgroundColor: "#FFF",
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 120,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 25,
    left: 16,
    right: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cancelButton: {
    backgroundColor: "#FF5252",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
    alignItems: "center",
  },
  saveButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  formTitle: {
    marginTop: 35,
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  fieldTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 7,
  },
  input: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  inputError: {
    borderColor: "#FF5252",
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  detectionSection: {
    marginVertical: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
  },
  detectionHeader: {
    fontWeight: "bold",
    fontSize: 12,
    marginBottom: 8,
  },
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  timeInput: {
    flex: 0.45,
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    padding: 8,
  },
  sliderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  sliderLabel: {
    marginRight: 10,
  },
  durationInput: {
    marginLeft: 8,
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    padding: 8,
    width: 80,
  },
});
