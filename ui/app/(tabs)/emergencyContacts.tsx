import React, { useState, useEffect, useCallback } from "react";
import { View, Alert, Modal } from "react-native";
import {
  getContacts,
  addContact,
  updateContact,
  deleteContact,
} from "../api/services/contactService";
import { Contact, NewContact } from "../api/types/contactTypes";
import { ContactList } from "../components/ContactList";
import { ContactForm } from "../components/ContactForm";
import { styles } from "./styles/ContactScreen.styles";
import { AxiosError } from "axios";

const REFRESH_INTERVAL = 30000;

const ContactScreen = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentContact, setCurrentContact] = useState<Contact | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchContacts = useCallback(async () => {
    try {
      const data = await getContacts();
      setContacts(data);
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status !== 404) {
        console.error("Error fetching contacts:", error);
        Alert.alert("Error", "Failed to fetch contacts.");
      }
    }
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchContacts();
    setRefreshing(false);
  }, [fetchContacts]);

  useEffect(() => {
    fetchContacts();
    
    const intervalId = setInterval(fetchContacts, REFRESH_INTERVAL);
    
    return () => clearInterval(intervalId);
  }, [fetchContacts]);

  const handleAddContact = async (newContact: NewContact) => {
    try {
      const response = await addContact(newContact);
      setContacts((prev) => [...prev, response]);
      setModalVisible(false);
      setCurrentContact(null);
    } catch (error) {
      console.error("Error adding contact:", error);
      Alert.alert("Error", "Failed to add contact.");
    }
  };

  const handleUpdateContact = async (contact: Contact) => {
    try {
      const response = await updateContact(contact);
      setContacts((prev) =>
        prev.map((item) => (item.id === contact.id ? response : item))
      );
      setModalVisible(false);
      setCurrentContact(null);
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status !== 404) {
        console.error("Error updating contact:", error);
        Alert.alert("Error", "Failed to update contact.");
      }
    }
  };

  const handleDeleteContact = async (contact: Contact) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this contact?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteContact(contact);
              setContacts((prev) =>
                prev.filter((con) => con.id !== contact.id)
              );
            } catch (error) {
              if (error instanceof AxiosError && error.response?.status !== 404) {
                console.error("Error deleting contact:", error);
                Alert.alert("Error", "Failed to delete contact.");
              }
            }
          },
        },
      ]
    );
  };

  const openModal = (contact: Contact | null) => {
    setCurrentContact(contact);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <ContactList
        contacts={contacts}
        onContactSelect={openModal}
        onDeleteContact={handleDeleteContact}
        onAddContact={() => openModal(null)}
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
      <Modal visible={modalVisible} animationType="slide">
        <ContactForm
          contact={currentContact}
          onSave={currentContact ? handleUpdateContact : handleAddContact}
          onCancel={() => setModalVisible(false)}
        />
      </Modal>
    </View>
  );
};

export default ContactScreen;
