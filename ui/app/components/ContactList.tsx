import React from "react";
import { FlatList, RefreshControl } from "react-native";
import { Contact } from "../api/types/contactTypes";
import { ContactListItem } from "./ContactListItem";
import { AddButton } from "./common/components/AddButton";

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
        <AddButton title="Add New Contact" onPress={onAddContact} />
      }
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    />
  );
};
