import React, { useState, useEffect } from 'react';
import { Text, View, FlatList, TouchableOpacity, TextInput, Switch, Modal, StyleSheet } from 'react-native';
import { getContacts, addContact, updateContact, deleteContact } from '../api/contactsApi';

type Contact = {
  id: number; // Primary key
  name: string; // Contact name
  phone_number: string; // Contact phone number
  status: 0 | 1; // Active (1) or inactive (0)
};

export default function EmergencyContacts() {
  // State for contacts, modal visibility, and the current contact
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentContact, setCurrentContact] = useState<Contact | null>(null);

  // Fetch contacts from the API on component mount
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

  // Handle saving a new or existing contact
  const handleSaveContact = async (contact: Contact) => {
    try {
      const statusValue = contact.status; // 0 or 1
      if (contact.id) {
        // Update an existing contact
        const updated = await updateContact(contact.id, {
          name: contact.name,
          phoneNumber: contact.phone_number,
          status: statusValue,
        });
        setContacts((prev) =>
          prev.map((item) => (item.id === contact.id ? updated : item))
        );
      } else {
        // Add a new contact
        const newContact = await addContact({
          name: contact.name,
          phoneNumber: contact.phone_number,
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

  // Handle deleting a contact
  const handleDeleteContact = async (id: number) => {
    try {
      await deleteContact(id);
      setContacts((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  };

  // Open the modal with or without a specific contact
  const openModal = (contact: Contact | null = null) => {
    setCurrentContact(contact);
    setModalVisible(true);
  };

  // Render a single contact item
  const renderContact = ({ item }: { item: Contact }) => (
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

// ContactForm Component
const ContactForm = ({
  contact,
  onSave,
  onCancel,
}: {
  contact: Contact | null;
  onSave: (contact: Contact) => void;
  onCancel: () => void;
}) => {
  const [name, setName] = useState(contact?.name || '');
  const [phone, setPhone] = useState(contact?.phone_number || '');
  const [active, setActive] = useState(contact?.status === 1);

  const handleSave = () => {
    onSave({
      id: contact?.id || 0, // Use 0 or another placeholder for new contacts
      name,
      phone_number: phone,
      status: active ? 1 : 0,
    });
  };

  return (
    <View style={styles.formContainer}>
      <Text style={styles.formTitle}>
        {contact ? 'Edit Contact' : 'Add New Contact'}
      </Text>

      {/* Name Input */}
      <Text style={styles.fieldTitle}>Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        placeholderTextColor="#7D7D7D"
        value={name}
        onChangeText={setName}
      />

      {/* Phone Number Input */}
      <Text style={styles.fieldTitle}>Phone Number</Text>
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        placeholderTextColor="#7D7D7D"
        value={phone}
        onChangeText={setPhone}
      />

      {/* Active Switch */}
      <View style={styles.switchContainer}>
        <Text>Active?</Text>
        <Switch value={active} onValueChange={setActive} />
      </View>
      
      {/* Buttons at the bottom */}
      <View style={styles.buttonContainer}>
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
  buttonContainer: {
    position: 'absolute',
    bottom: 25,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    backgroundColor: '#FF5252',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
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
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  fieldTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 7,
  },
});