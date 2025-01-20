import axios from 'axios';

// Set the Flask API base URL
const API_BASE_URL = 'http://localhost:5000'; 

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getContacts = async () => {
  const response = await api.get('/contacts');
  return response.data;
};

export const addContact = async (contact) => {
  const response = await api.post('/contacts', contact);
  return response.data;
};

export const updateContact = async (id, contact) => {
  const response = await api.put(`/contacts/${id}`, contact);
  return response.data;
};

export const deleteContact = async (id: number) => {
    const response = await api.delete(`/contacts/${id}`);
    return response.data;
  };
  