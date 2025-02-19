import { apiClient } from "../apiClient";
import { Contact, NewContact } from "../types/contactTypes";

export const getContacts = async (): Promise<Contact[]> => {
  const response = await apiClient.get("/contacts");
  return response.data;
};

export const addContact = async (contact: NewContact): Promise<Contact> => {
  const response = await apiClient.post("/contacts", contact);
  return response.data;
};

export const updateContact = async (contact: Contact): Promise<Contact> => {
  const response = await apiClient.put(`/contacts/${contact.id}`, contact);
  return response.data;
};

export const deleteContact = async (
  contact: Contact
): Promise<{ message: string }> => {
  const response = await apiClient.delete(`/contacts/${contact.id}`);
  return response.data;
};

export const testAlertContact = async (contactId: number): Promise<{ message: string }> => {
  const response = await apiClient.post(`/contacts/${contactId}/test-alert`);
  return response.data;
};
