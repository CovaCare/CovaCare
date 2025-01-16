import { Text, View, StyleSheet } from 'react-native';

export default function EmergencyContacts() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Emergency Contact screen</Text>
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
