import React, { useState, useEffect } from 'react';
import { Text, View, FlatList, TouchableOpacity, TextInput, Switch, Modal, StyleSheet } from 'react-native';
import { getContacts, addContact, updateContact, deleteContact } from '../api/contactsApi';

export default function EmergencyContacts() {
  const [contacts, setContacts] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentContact, setCurrentContact] = useState(null);

  // Fetch contacts from API
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const data = await getContacts();
        setContacts(data);
      } catch (error) {
        console.error('Error fetching contacts:', error);
      }
    };

    fetchContacts();
  }, []);

  const handleSaveContact = async (contact) => {
    try {
      // Convert the boolean `active` into 1 (true) or 0 (false)
      const statusValue = contact.active ? 1 : 0;
      
      if (contact.id) {
        // Update existing contact
        const updated = await updateContact(contact.id, {
          name: contact.name,
          phoneNumber: contact.phone,
          status: statusValue,
        });
        setContacts((prev) =>
          prev.map((item) => (item.id === contact.id ? updated : item))
        );
      } else {
        // Add new contact
        const newContact = await addContact({
          name: contact.name,
          phoneNumber: contact.phone, // or contact.phone_number
          status: statusValue,
        });
        setContacts((prev) => [...prev, newContact]);
      }
      setModalVisible(false);
      setCurrentContact(null);
    } catch (error) {
      console.error('Error saving contact:', error);
    }
  };

  const handleDeleteContact = async (id) => {
    try {
      await deleteContact(id);
      setContacts((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  };
  


  const openModal = (contact = null) => {
    setCurrentContact(contact);
    setModalVisible(true);
  };

  const renderContact = ({ item }) => (
    <View style={styles.contactItem}>
      <TouchableOpacity
        onPress={() => openModal(item)}
        style={{ flex: 1 }}
      >
        <View>
          <Text style={styles.contactName}>{item.name}</Text>
          <Text style={styles.contactPhone}>{item.phone_number}</Text>
          <Text style={styles.contactStatus}>
            Status: {item.status === 1 ? 'Active' : 'Inactive'}
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteContact(item.id)}
      >
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );
  

  return (
    <View style={styles.container}>
      <FlatList
        data={contacts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderContact}
        ListFooterComponent={
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => openModal()}
          >
            <Text style={styles.addButtonText}>Add New</Text>
          </TouchableOpacity>
        }
      />
      <Modal visible={modalVisible} animationType="slide">
        <ContactForm
          contact={currentContact}
          onSave={handleSaveContact}
          onCancel={() => setModalVisible(false)}
        />
      </Modal>
    </View>
  );
}
const ContactForm = ({ contact, onSave, onCancel }) => {
  const [name, setName] = useState(contact?.name || '');
  const [phone, setPhone] = useState(contact?.phone_number || '');
  const [active, setActive] = useState(contact?.status === 1);

  const handleSave = () => {
    onSave({
      id: contact?.id, // Use the existing ID for updates
      name,
      phone,
      active,
    });
  };

  return (
    <View style={styles.formContainer}>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />
      <View style={styles.switchContainer}>
        <Text>Active?</Text>
        <Switch value={active} onValueChange={setActive} />
      </View>
      <View style={styles.formButtons}>
        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  contactItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  contactName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  contactPhone: {
    fontSize: 16,
    color: '#666',
  },
  contactStatus: {
    fontSize: 14,
    color: '#999',
  },
  addButton: {
    margin: 16,
    padding: 16,
    backgroundColor: '#007BFF',
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  formContainer: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  formButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    backgroundColor: '#FF5252',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
  },
  saveButton: {
    backgroundColor: '#007BFF',
    padding: 12,
    borderRadius: 8,
    flex: 1,
  },
  deleteButton: {
    backgroundColor: '#FF5252',
    padding: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
  deleteButtonText: {
    color: '#FFF',
    fontSize: 12,
  },
  buttonText: {
    color: '#FFF',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});