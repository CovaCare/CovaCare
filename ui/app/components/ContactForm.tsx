import { useState } from "react";
import { Contact, NewContact } from "../api/types/contactTypes";
import { BaseForm } from "./common/components/BaseForm";
import { FormField } from "./common/components/FormField";
import { ToggleField } from "./common/components/ToggleField";
import { Card } from "./common/components/Card";

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
  const [nameError, setNameError] = useState<boolean>(false);
  const [phoneError, setPhoneError] = useState<boolean>(false);

  const handleSave = () => {
    setNameError(false);
    setPhoneError(false);

    let valid = true;

    if (name.trim() === "") {
      setNameError(true);
      valid = false;
    }
    if (phone.trim() === "") {
      setPhoneError(true);
      valid = false;
    }
    if (!valid) return;

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
    <BaseForm
      title={contact ? "Edit Contact" : "Add New Contact"}
      onSave={handleSave}
      onCancel={onCancel}
    >
      <Card title="Contact Information" description="">
        <FormField
          label="Name"
          value={name}
          onChangeText={setName}
          error={nameError}
          placeholder="Enter the contact's name"
          maxLength={50}
        />

        <FormField
          label="Phone Number"
          value={phone}
          onChangeText={setPhone}
          error={phoneError}
          placeholder="Enter the contact's phone number"
          keyboardType="numeric"
        />

        <ToggleField
          label="Active"
          infoButtonTitle={"Status"}
          infoButtonMessage={
            "Only active contacts will be sent emergency alerts."
          }
          spaceBetween={false}
          value={active}
          onValueChange={setActive}
        />
      </Card>
    </BaseForm>
  );
};
