import * as FileSystem from 'expo-file-system';

const CONTACTS_FILE = `${FileSystem.documentDirectory}contacts.json`;

export const initializeContacts = async () => {
  const fileInfo = await FileSystem.getInfoAsync(CONTACTS_FILE);
  if (!fileInfo.exists) {
    await FileSystem.writeAsStringAsync(CONTACTS_FILE, JSON.stringify([]));
  }
};

export const getContacts = async () => {
  try {
    const data = await FileSystem.readAsStringAsync(CONTACTS_FILE);
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading contacts:', error);
    return [];
  }
};

export const saveContacts = async (contacts: any[]) => {
  try {
    await FileSystem.writeAsStringAsync(CONTACTS_FILE, JSON.stringify(contacts, null, 2));
  } catch (error) {
    console.error('Error saving contacts:', error);
  }
};
