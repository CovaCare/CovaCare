import axios from 'axios';

// Set the Flask API base URL
import { API_BASE_URL } from './apiConfig';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Define the Camera type matching the backend fields
export type Camera = {
  id: number;
  name: string;
  username: string;
  password: string;
  stream_url: string;
  fall_detection_enabled: number;
  inactivity_detection_enabled: number;
  created_at: string;
  updated_at: string;
};

// Get all cameras
export const getCameras = async (): Promise<Camera[]> => {
  const response = await api.get('/cameras');
  return response.data;
};

// Add a new camera
export const addCamera = async (camera: {
  name: string;
  username: string;
  password: string;
  stream_url: string;
  fall_detection_enabled?: number;
  inactivity_detection_enabled?: number;
}): Promise<Camera> => {
  const response = await api.post('/cameras', camera);
  return response.data;
};

// Update an existing camera
export const updateCamera = async (
  id: number,
  camera: {
    name: string;
    username: string;
    password: string;
    stream_url: string;
    fall_detection_enabled?: number;
    inactivity_detection_enabled?: number;
  }
): Promise<Camera> => {
  const response = await api.put(`/cameras/${id}`, camera);
  return response.data;
};

// Delete a camera
export const deleteCamera = async (id: number): Promise<{ message: string }> => {
  const response = await api.delete(`/cameras/${id}`);
  return response.data;
};