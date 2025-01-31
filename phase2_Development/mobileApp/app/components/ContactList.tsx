import React from "react";
import { FlatList } from "react-native";
import { Contact } from "../api/types/contactTypes";
import { ContactListItem } from "./ContactListItem";

interface ContactListProps {
  contacts: Contact[];
  onContactSelect: (contact: Contact | null) => void;
  onDeleteContact: (contact: Contact) => void;
}

export const ContactList = ({
  contacts,
  onContactSelect,
  onDeleteContact,
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
    />
  );
};
