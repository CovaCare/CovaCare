import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { getContacts, initializeContacts } from '../utils/fileUtils';

export default function EmergencyContacts() {
  const router = useRouter();
  const [contacts, setContacts] = useState<any[]>([]);

  const loadContacts = async () => {
    await initializeContacts();
    const data = await getContacts();
    setContacts(data);
  };

  // Load contacts when the screen is focused
  useFocusEffect(
    React.useCallback(() => {
      loadContacts();
    }, [])
  );

  const renderContact = ({ item }) => (
    <TouchableOpacity
      style={styles.contactItem}
      onPress={() => router.push(`../emergency-contacts/edit-contact/${item.id}`)}
    >
      <View>
        <Text style={styles.contactName}>{item.name}</Text>
        <Text style={styles.contactPhone}>{item.phone}</Text>
        <Text style={styles.contactStatus}>
          Status: <Text style={item.status === 'Active' ? styles.active : styles.inactive}>{item.status}</Text>
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {contacts.length === 0 ? (
        <Text style={styles.noContactsText}>No contacts available. Add a new contact.</Text>
      ) : (
        <FlatList
          data={contacts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderContact}
          contentContainerStyle={styles.contactList}
        />
      )}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push('../emergency-contacts/add-contact')}
      >
        <Text style={styles.addButtonText}>Add New</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    padding: 16,
  },
  contactList: {
    flexGrow: 1,
  },
  contactItem: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  contactName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#25292e',
  },
  contactPhone: {
    fontSize: 14,
    color: '#25292e',
    marginTop: 4,
  },
  contactStatus: {
    fontSize: 14,
    color: '#25292e',
    marginTop: 4,
  },
  active: {
    color: '#00AA00',
    fontWeight: 'bold',
  },
  inactive: {
    color: '#AA0000',
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  noContactsText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#555',
  },
});
