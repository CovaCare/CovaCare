import { StyleSheet, Dimensions } from "react-native";
import colors from "../constants/colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background.primary,
    padding: 20,
  },
  contentContainer: {
    alignItems: "center",
    maxWidth: 600,
    width: "100%",
  },
  title: {
    fontSize: 50,
    fontWeight: "bold",
    color: colors.text.primary,
    marginBottom: 16,
    textAlign: "center",
  },
  message: {
    fontSize: 24,
    color: colors.text.secondary,
    marginBottom: 32,
    textAlign: "center",
    lineHeight: 32,
  },
  button: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    shadowColor: colors.shadow.default,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: colors.text.light,
    fontSize: 18,
    fontWeight: "600",
  },
});
