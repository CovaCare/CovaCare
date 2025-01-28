import React, { useState, useEffect } from 'react';
import { Text, View, FlatList, TouchableOpacity, TextInput, Switch, Modal, StyleSheet, Alert } from 'react-native';
import {
  getCameras,
  addCamera,
  updateCamera,
  deleteCamera,
  Camera as CameraType,
} from '../api/camerasApi';

type Camera = CameraType;

export default function CamerasScreen() {
  // States for camera list, modal control, and current camera
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentCamera, setCurrentCamera] = useState<Camera | null>(null);

  // Load cameras on mount
  useEffect(() => {
    const fetchCameras = async () => {
      try {
        const data = await getCameras();
        setCameras(data);
      } catch (error) {
        console.error('Error fetching cameras:', error);
        Alert.alert('Error', 'Failed to fetch cameras.');
      }
    };
    fetchCameras();
  }, []);

  // Add or update a camera
  const handleSaveCamera = async (camera: Camera) => {
    try {
      if (camera.id) {
        // Update existing camera
        const updated = await updateCamera(camera.id, {
          name: camera.name,
          username: camera.username,
          password: camera.password,
          stream_url: camera.stream_url,
        });
        setCameras((prev) =>
          prev.map((item) => (item.id === camera.id ? updated : item))
        );
      } else {
        // Add new camera
        const newCam = await addCamera({
          name: camera.name,
          username: camera.username,
          password: camera.password,
          stream_url: camera.stream_url,
        });
        setCameras((prev) => [...prev, newCam]);
      }
      setModalVisible(false);
      setCurrentCamera(null);
    } catch (error) {
      console.error('Error saving camera:', error);
      Alert.alert('Error', 'Failed to save camera.');
    }
  };

  // Delete a camera
  const handleDeleteCamera = async (id: number) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this camera?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteCamera(id);
              setCameras((prev) => prev.filter((cam) => cam.id !== id));
            } catch (error) {
              console.error('Error deleting camera:', error);
              Alert.alert('Error', 'Failed to delete camera.');
            }
          },
        },
      ]
    );
  };

  // Open modal (for either new camera or editing an existing one)
  const openModal = (camera: Camera | null = null) => {
    setCurrentCamera(camera);
    setModalVisible(true);
  };

  // Renders one item in the camera list
  const renderCameraItem = ({ item }: { item: Camera }) => (
    <View style={styles.cameraItem}>
      <TouchableOpacity onPress={() => openModal(item)} style={{ flex: 1 }}>
        <Text style={styles.cameraName}>{item.name}</Text>
        <Text style={styles.cameraDetails}>IP: {item.stream_url}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteCamera(item.id)}
      >
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={cameras}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderCameraItem}
        ListFooterComponent={
          <TouchableOpacity style={styles.addButton} onPress={() => openModal()}>
            <Text style={styles.addButtonText}>Add New</Text>
          </TouchableOpacity>
        }
      />

      {/* Camera Form Modal */}
      <Modal visible={modalVisible} animationType="slide">
        <CameraForm
          camera={currentCamera}
          onSave={handleSaveCamera}
          onCancel={() => setModalVisible(false)}
        />
      </Modal>
    </View>
  );
}

// Inline CameraForm component
function CameraForm({
  camera,
  onSave,
  onCancel,
}: {
  camera: Camera | null;
  onSave: (camera: Camera) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(camera?.name || '');
  const [username, setUsername] = useState(camera?.username || '');
  const [password, setPassword] = useState(camera?.password || '');
  const [stream_url, setStreamUrl] = useState(camera?.stream_url || '');

  const handleSave = () => {
    onSave({
      id: camera?.id || 0, // 0 if new
      name,
      username,
      password,
      stream_url,
      fall_detection_enabled: fall_detection_enabled ? 1 : 0,
      inactivity_detection_enabled: inactivity_detection_enabled ? 1 : 0,
      created_at: camera?.created_at || '',
      updated_at: camera?.updated_at || '',
    });
  };

  return (
    <View style={styles.formContainer}>
      {/* Display a title based on whether a camera exists */}
      <Text style={styles.formTitle}>
        {camera ? 'Edit Camera' : 'Add New Camera'}
      </Text>

      {/* Name */}
      <Text style={styles.fieldTitle}>Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Camera Name"
        placeholderTextColor="#7D7D7D"
        value={name}
        onChangeText={setName}
      />

      {/* Username */}
      <Text style={styles.fieldTitle}>User Name</Text>
      <TextInput
        style={styles.input}
        placeholder="admin"
        placeholderTextColor="#7D7D7D"
        value={username}
        onChangeText={setUsername}
      />

      {/* Password */}
      <Text style={styles.fieldTitle}>Password</Text>
      <TextInput
        style={styles.input}
        placeholder="••••••"
        placeholderTextColor="#7D7D7D"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {/* Stream URL (IP Address) */}
      <Text style={styles.fieldTitle}>Stream URL</Text>
      <TextInput
        style={styles.input}
        placeholder="192.168.0.100"
        placeholderTextColor="#7D7D7D"
        value={stream_url}
        onChangeText={setStreamUrl}
      />

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
      </View>

      {/* Live feed placeholder */}
      <View style={styles.liveFeedPlaceholder}>
        <Text style={{ color: '#888' }}>Live Feed Preview</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Screen container
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  // List items
  cameraItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cameraName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  cameraDetails: {
    fontSize: 14,
    color: '#666',
  },
  // Add button
  addButton: {
    margin: 16,
    padding: 16,
    backgroundColor: '#007BFF',
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Delete button
  deleteButton: {
    backgroundColor: '#FF5252',
    padding: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
  deleteButtonText: {
    color: '#FFF',
    fontSize: 12,
  },
  // Form container
  formContainer: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  fieldTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 7,
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  // Switch container
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  // Bottom buttons
  buttonContainer: {
    position: 'absolute',
    bottom: 25,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    backgroundColor: '#FF5252',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  liveFeedPlaceholder: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    backgroundColor: '#EFEFEF',
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
