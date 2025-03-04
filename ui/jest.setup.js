import 'react-native-gesture-handler/jestSetup';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('expo-status-bar');

global.fetch = jest.fn();

jest.mock('@expo/vector-icons', () => ({
    MaterialIcons: 'MaterialIcons',
  }));
  
  jest.mock('expo-font', () => ({
    isLoaded: jest.fn(() => true),
    loadAsync: jest.fn()
  }));