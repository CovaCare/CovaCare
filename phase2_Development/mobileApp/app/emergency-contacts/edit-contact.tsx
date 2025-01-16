// app/emergency-contacts/edit-contact/[id].tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter, useSearchParams } from 'expo-router';

export default function EditContact() {
  const router = useRouter();
  const { id } = useSearchParams();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState('Active');

  useEffect(() => {
    const loadContact = async () => {
      const contacts = await getContacts();
      const contact = contacts.find((c) => c.id.toString() === id);
      if (contact) {
        setName(contact.name);
        setPhone(contact.phone);
        setStatus(contact.status);
      } else {
        Alert.alert('Error', 'Contact not found.', [
          { text: 'OK', onPress: () => router.back() },
        ]);
      }
    };

    loadContact();
  }, [id]);

  const handleSave = async () => {
    if (!name.trim() || !phone.trim()) {
      Alert.alert('Validation Error', 'Name and Phone are required.');
      return;
    }

    try {
      const contacts = await getContacts();
      const updatedContacts = contacts.map((contact) =>
        contact.id.toString() === id
          ? { ...contact, name, phone, status }
          : contact
      );
      await saveContacts(updatedContacts);
      Alert.alert('Success', 'Contact updated successfully.', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (error) {
      console.error('Error updating contact:', error);
      Alert.alert('Error', 'There was an error updating the contact.');
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

      <Text style={styles.label}>Status</Text>
      <View style={styles.statusContainer}>
        <TouchableOpacity
          style={[styles.statusButton, status === 'Active' && styles.selectedStatus]}
          onPress={() => setStatus('Active')}
        >
          <Text style={styles.statusText}>Active</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.statusButton, status === 'Inactive' && styles.selectedStatus]}
          onPress={() => setStatus('Inactive')}
        >
          <Text style={styles.statusText}>Inactive</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Update Contact</Text>
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
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
  },
  statusButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  selectedStatus: {
    backgroundColor: '#007AFF',
  },
  statusText: {
    color: '#007AFF',
    fontWeight: 'bold',
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
