import React, { useState, useEffect } from "react";
import { View, Alert, Modal, TouchableOpacity, Text } from "react-native";
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

const CameraScreen = () => {
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentCamera, setCurrentCamera] = useState<Camera | null>(null);

  useEffect(() => {
    const fetchCameras = async () => {
      try {
        const data = await getCameras();
        setCameras(data);
      } catch (error) {
        console.error("Error fetching cameras:", error);
        Alert.alert("Error", "Failed to fetch cameras.");
      }
    };
    fetchCameras();
  }, []);

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
      console.error("Error updating camera:", error);
      Alert.alert("Error", "Failed to update camera.");
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
              console.error("Error deleting camera:", error);
              Alert.alert("Error", "Failed to delete camera.");
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
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => openModal(null)}
      >
        <Text style={styles.addButtonText}>Add New Camera</Text>
      </TouchableOpacity>
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
