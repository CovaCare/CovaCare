import { useState } from "react";
import { Contact, NewContact } from "../api/types/contactTypes";
import { Text, View, TouchableOpacity, TextInput, Switch } from "react-native";
import { styles } from "./ContactForm.styles";

interface ContactFormProps {
  contact: Contact | null;
  onSave:
    | ((contact: Contact) => Promise<void>)
    | ((contact: NewContact) => Promise<void>);
  onCancel: () => void;
}

export const ContactForm = ({
  contact,
  onSave,
  onCancel,
}: ContactFormProps) => {
  const [name, setName] = useState(contact?.name || "");
  const [phone, setPhone] = useState(contact?.phone_number || "");
  const [active, setActive] = useState(contact ? contact.status === 1 : true);

  const handleSave = () => {
    if (contact) {
      //Update
      const updatedContact: Contact = {
        id: contact.id,
        name,
        phone_number: phone,
        status: active ? 1 : 0,
        created_at: contact.created_at,
        updated_at: contact.updated_at,
      };
      (onSave as (contact: Contact) => Promise<void>)(updatedContact);
    } else {
      //Add
      const newContact: NewContact = {
        name,
        phone_number: phone,
        status: active ? 1 : 0,
      };
      (onSave as (contact: NewContact) => Promise<void>)(newContact);
    }
  };

  return (
    <View style={styles.formContainer}>
      <Text style={styles.formTitle}>
        {contact ? "Edit Contact" : "Add New Contact"}
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
