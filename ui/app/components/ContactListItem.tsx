import React, { useState } from "react";
import { Text, View, TouchableOpacity, Alert } from "react-native";
import { Contact } from "../api/types/contactTypes";
import { styles } from "./ContactListItem.styles";
import { testAlertContact } from "../api/services/contactService";

interface ContactListItemProps {
  contact: Contact;
  onSelect: (contact: Contact) => void;
  onDelete: (contact: Contact) => void;
}

export const ContactListItem = ({
  contact,
  onSelect,
  onDelete,
}: ContactListItemProps) => {
  const handleTestAlert = async () => {
    try {
      const response = await testAlertContact(contact.id);
      Alert.alert("Success", response.message);
    } catch (error) {
      console.error("Error sending test alert:", error);
      Alert.alert("Error", "Failed to send test alert.");
    }
  };

  return (
    <View style={styles.contactItem}>
      <TouchableOpacity onPress={() => onSelect(contact)} style={{ flex: 1 }}>
        <View>
          <Text style={styles.contactName}>{contact.name}</Text>
          <Text style={styles.contactPhone}>{contact.phone_number}</Text>
          <Text style={styles.contactStatus}>
            Status:{' '}
            <Text style={contact.status === 1 ? styles.active : styles.inactive}>
              {contact.status === 1 ? "Active" : "Inactive"}
            </Text>
          </Text>
        </View>
      </TouchableOpacity>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.testButton}
          onPress={handleTestAlert}
        >
          <Text style={styles.buttonText}>Test Alert</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => onDelete(contact)}
        >
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
