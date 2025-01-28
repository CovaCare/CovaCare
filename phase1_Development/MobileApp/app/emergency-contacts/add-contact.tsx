// app/emergency-contacts/add-contact.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  Switch,
} from 'react-native';
import { useRouter } from 'expo-router';
import { getContacts, saveContacts } from '../utils/fileUtils';

export default function AddContact() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isActive, setIsActive] = useState(true); 

  const handleSave = async () => {
    if (!name.trim() || !phone.trim()) {
      Alert.alert('Validation Error', 'Name and Phone are required.');
      return;
    }

    const newContact = {
      id: Date.now(), 
      name,
      phone,
      status: isActive ? 'Active' : 'Inactive',
    };

    try {
      const existingContacts = await getContacts();
      const updatedContacts = [...existingContacts, newContact];
      await saveContacts(updatedContacts);
      Alert.alert('Success', 'Contact added successfully.', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (error) {
      console.error('Error saving contact:', error);
      Alert.alert('Error', 'There was an error saving the contact.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Enter contact name"
      />

      <Text style={styles.label}>Phone</Text>
      <TextInput
        style={styles.input}
        value={phone}
        onChangeText={setPhone}
        placeholder="Enter phone number"
        keyboardType="phone-pad"
      />

      <View style={styles.statusContainer}>
        <Text style={styles.label}>Status</Text>
        <View style={styles.switchContainer}>
          <Text style={styles.statusText}>{isActive ? 'Active' : 'Inactive'}</Text>
          <Switch
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={isActive ? '#007AFF' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={setIsActive}
            value={isActive}
          />
        </View>
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save Contact</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F9F9F9',
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    backgroundColor: '#fff',
  },
  statusContainer: {
    marginTop: 16,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    justifyContent: 'space-between',
  },
  statusText: {
    fontSize: 16,
    color: '#333',
  },
  saveButton: {
    backgroundColor: '#28a745',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
