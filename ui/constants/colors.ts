export const colors = {
  // Primary colors
  primary: '#007BFF',
  
  background: {
    primary: '#f8f9fa',
    secondary: '#ffffff',
  },
  
  // Text colors
  text: {
    primary: '#2d3748',
    secondary: '#4a5568',
    light: '#ffffff',
  },
  
  // Shadow colors
  shadow: {
    default: '#000000',
  },
  
  // Status colors
  status: {
    success: '#red',
    error: '#f56565',
    warning: '#ed8936',
    info: '#4299e1',
  },
} as const;

// Type for strongly typed color access
export type ColorKeys = typeof colors;

export default colors; 