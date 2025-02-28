import React from "react";
import { FlatList, TouchableOpacity, Text, RefreshControl } from "react-native";
import { Contact } from "../api/types/contactTypes";
import { ContactListItem } from "./ContactListItem";
import { styles } from "../(tabs)/styles/ContactScreen.styles";

interface ContactListProps {
  contacts: Contact[];
  onContactSelect: (contact: Contact) => void;
  onDeleteContact: (contact: Contact) => void;
  onAddContact: () => void;
  refreshing?: boolean;
  onRefresh?: () => void;
}

export const ContactList = ({
  contacts,
  onContactSelect,
  onDeleteContact,
  onAddContact,
  refreshing = false,
  onRefresh,
}: ContactListProps) => {
  return (
    <FlatList
      data={contacts}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <ContactListItem
          contact={item}
          onSelect={onContactSelect}
          onDelete={onDeleteContact}
        />
      )}
      ListFooterComponent={
        <TouchableOpacity style={styles.addButton} onPress={onAddContact}>
          <Text style={styles.addButtonText}>Add New Contact</Text>
        </TouchableOpacity>
      }
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    />
  );
};
