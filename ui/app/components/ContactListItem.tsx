import React from "react";
import { Text, View, TouchableOpacity, Alert } from "react-native";
import { Contact } from "../api/types/contactTypes";
import { styles } from "./ContactListItem.styles";
import { testAlertContact } from "../api/services/contactService";
import { Trash2, Bell, Phone } from 'lucide-react-native';

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
          <View style={styles.phoneContainer}>
            <Phone size={16} color="#666" />
            <Text style={styles.contactPhone}>{contact.phone_number}</Text>
          </View>
          <Text style={styles.contactStatus}>
            Status:{" "}
            <Text
              style={contact.status === 1 ? styles.active : styles.inactive}
            >
              {contact.status === 1 ? "Active" : "Inactive"}
            </Text>
          </Text>
        </View>
      </TouchableOpacity>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={() => onDelete(contact)} testID="deleteIcon">
          <Trash2 size={25} color="red" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.testButton} onPress={handleTestAlert}>
          <View style={styles.buttonContent}>
            <Bell size={16} color="#fff" />
            <Text style={styles.buttonText}>Alert</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};
