import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
  },
  formTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
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
  liveFeedPlaceholder: {
    width: "100%",
    height: 150,
    borderRadius: 8,
    backgroundColor: "#EFEFEF",
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});
