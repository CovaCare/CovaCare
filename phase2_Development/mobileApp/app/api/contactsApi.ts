import axios from 'axios';

// Set the Flask API base URL
import { API_BASE_URL } from './apiConfig'; 

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export type Contact = {
  id: number;
  name: string;
  phone_number: string;
  status: 0 | 1;
  created_at?: string;
  updated_at?: string;
};

// Retrieves all contacts
export const getContacts = async (): Promise<Contact[]> => {
  try {
    const response = await api.get('/contacts');
    return response.data;
  } catch (error) {
    console.error('Error fetching contacts:', error);
    throw error; // Propagate the error to be handled by the caller
  }
};


// Adds a new contact
export const addContact = async (
  contact: Omit<Contact, 'id' | 'created_at' | 'updated_at'>
): Promise<Contact> => {
  try {
    const response = await api.post('/contacts', contact);
    return response.data;
  } catch (error) {
    console.error('Error adding contact:', error);
    throw error;
  }
};

// Updates an existing contact
export const updateContact = async (
  id: number,
  contact: Partial<Omit<Contact, 'id' | 'created_at' | 'updated_at'>>
): Promise<Contact> => {
  try {
    const response = await api.put(`/contacts/${id}`, contact);
    return response.data;
  } catch (error) {
    console.error(`Error updating contact with ID ${id}:`, error);
    throw error;
  }
};

// Deletes a contact
export const deleteContact = async (
  id: number
): Promise<{ message: string }> => {
  try {
    const response = await api.delete(`/contacts/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting contact with ID ${id}:`, error);
    throw error;
  }
};
