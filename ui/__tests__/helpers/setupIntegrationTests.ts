import { jest } from '@jest/globals';
import 'react-native-gesture-handler/jestSetup';

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  useLocalSearchParams: () => ({}),
  Slot: require('react-native').View,
  Tabs: require('react-native').View,
  Stack: require('react-native').View,
  useSegments: () => [],
  useRootNavigationState: () => ({
    key: 'root',
    index: 0,
    routeNames: ['index'],
    history: [],
    stale: false,
    type: 'stack',
    routes: [{ key: 'index', name: 'index' }],
  }),
}));

jest.mock('@expo/vector-icons', () => ({
  MaterialIcons: 'MaterialIcons',
  Ionicons: 'Ionicons',
  FontAwesome: 'FontAwesome',
  AntDesign: 'AntDesign',
}));

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

(global.fetch as jest.Mock) = jest.fn();

describe('Setup Integration Tests', () => {
  it('dummy test to prevent Jest errors', () => {
    expect(true).toBe(true);
  });
});
