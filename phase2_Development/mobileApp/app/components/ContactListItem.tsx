import React from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { Contact } from "../api/types/contactTypes";
import { styles } from "./ContactListItem.styles";

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
  return (
    <View style={styles.contactItem}>
      <TouchableOpacity onPress={() => onSelect(contact)} style={{ flex: 1 }}>
        <View>
          <Text style={styles.contactName}>{contact.name}</Text>
          <Text style={styles.contactPhone}>{contact.phone_number}</Text>
          <Text style={styles.contactStatus}>
            Status: {contact.status === 1 ? "Active" : "Inactive"}
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => onDelete(contact)}
      >
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );
};
