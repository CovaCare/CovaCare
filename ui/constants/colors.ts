export const colors = {
  // Primary colors
  primary: "#239be5",
  secondary: "#13b292",

  background: {
    primary: "#f8f9fa",
    secondary: "#ffffff",
  },

  // Text colors
  text: {
    primary: "#2d3748",
    secondary: "#7D8B97",
    light: "#ffffff",
  },

  // Shadow colors
  shadow: {
    default: "#000000",
  },

  // Status colors
  status: {
    error: "#ff5252",
    success: "#13b292",
    disabled: "#B0B0B0",
  },

  icon: {
    primary: "#6C757D",
    secondary: "white",
  },
} as const;

export type ColorKeys = typeof colors;

export default colors;
