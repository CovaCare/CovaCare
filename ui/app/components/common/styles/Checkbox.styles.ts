import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: 4,
  },
  checkboxContainer: {
    padding: 4, // For better touch area
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: "#007BFF",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  checked: {
    backgroundColor: "#007BFF",
  },
  checkmark: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  label: {
    fontSize: 14,
    color: "#333",
    fontWeight: "bold",
    marginBottom: 7,
  }
}); 