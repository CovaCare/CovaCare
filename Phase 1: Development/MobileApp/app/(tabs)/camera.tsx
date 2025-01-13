import { Text, View, StyleSheet } from 'react-native';

export default function cameraScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Camera screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#25292e',
  },
});
