import { apiClient } from "../apiClient";
import { Camera, NewCamera } from "../types/cameraTypes";

export const getCameras = async (): Promise<Camera[]> => {
  const response = await apiClient.get("/cameras");
  return response.data;
};

export const addCamera = async (camera: NewCamera): Promise<Camera> => {
  const response = await apiClient.post("/cameras", camera);
  return response.data;
};

export const updateCamera = async (camera: Camera): Promise<Camera> => {
  const response = await apiClient.put(`/cameras/${camera.id}`, camera);
  return response.data;
};

export const deleteCamera = async (
  camera: Camera
): Promise<{ message: string }> => {
  const response = await apiClient.delete(`/cameras/${camera.id}`);
  return response.data;
};
