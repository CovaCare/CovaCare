import React, { useState, useEffect, useCallback } from "react";
import { View, Alert, Modal, RefreshControl } from "react-native";
import {
  getCameras,
  addCamera,
  updateCamera,
  deleteCamera,
} from "../api/services/cameraService";
import { Camera, NewCamera } from "../api/types/cameraTypes";
import { CameraList } from "../components/CameraList";
import { CameraForm } from "../components/CameraForm";
import { styles } from "./styles/CameraScreen.styles";
import { AxiosError } from "axios";

const REFRESH_INTERVAL = 30000;

const CameraScreen = () => {
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentCamera, setCurrentCamera] = useState<Camera | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchCameras = useCallback(async () => {
    try {
      const data = await getCameras();
      setCameras(data);
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status !== 404) {
        console.error("Error fetching cameras:", error);
        Alert.alert("Error", "Failed to fetch cameras.");
      }
    }
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchCameras();
    setRefreshing(false);
  }, [fetchCameras]);

  useEffect(() => {
    fetchCameras();
    
    const intervalId = setInterval(fetchCameras, REFRESH_INTERVAL);
    
    return () => clearInterval(intervalId);
  }, [fetchCameras]);

  const handleAddCamera = async (newCamera: NewCamera) => {
    try {
      const response = await addCamera(newCamera);
      setCameras((prev) => [...prev, response]);
      setModalVisible(false);
      setCurrentCamera(null);
    } catch (error) {
      console.error("Error adding camera:", error);
      Alert.alert("Error", "Failed to add camera.");
    }
  };

  const handleUpdateCamera = async (camera: Camera) => {
    try {
      const response = await updateCamera(camera);
      setCameras((prev) =>
        prev.map((item) => (item.id === camera.id ? response : item))
      );
      setModalVisible(false);
      setCurrentCamera(null);
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status !== 404) {
        console.error("Error updating camera:", error);
        Alert.alert("Error", "Failed to update camera.");
      }
    }
  };

  const handleDeleteCamera = async (camera: Camera) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this camera?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteCamera(camera);
              setCameras((prev) => prev.filter((cam) => cam.id !== camera.id));
            } catch (error) {
              if (error instanceof AxiosError && error.response?.status !== 404) {
                console.error("Error deleting camera:", error);
                Alert.alert("Error", "Failed to delete camera.");
              }
            }
          },
        },
      ]
    );
  };

  const openModal = (camera: Camera | null) => {
    setCurrentCamera(camera);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <CameraList
        cameras={cameras}
        onCameraSelect={openModal}
        onDeleteCamera={handleDeleteCamera}
        onAddCamera={() => openModal(null)}
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
      <Modal visible={modalVisible} animationType="slide">
        <CameraForm
          camera={currentCamera}
          onSave={currentCamera ? handleUpdateCamera : handleAddCamera}
          onCancel={() => setModalVisible(false)}
        />
      </Modal>
    </View>
  );
};

export default CameraScreen;
