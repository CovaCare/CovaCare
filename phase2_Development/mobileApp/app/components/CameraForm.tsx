import { useState } from "react";
import { Camera, NewCamera } from "../api/types/cameraTypes";
import { Text, View, TouchableOpacity, TextInput } from "react-native";
import { styles } from "./CameraForm.styles";

interface CameraFormProps {
  camera: Camera | null;
  onSave:
    | ((camera: Camera) => Promise<void>)
    | ((camera: NewCamera) => Promise<void>);
  onCancel: () => void;
}

export const CameraForm = ({ camera, onSave, onCancel }: CameraFormProps) => {
  const [name, setName] = useState(camera?.name || "");
  const [username, setUsername] = useState(camera?.username || "");
  const [password, setPassword] = useState(camera?.password || "");
  const [stream_url, setStreamUrl] = useState(camera?.stream_url || "");

  const handleSave = () => {
    if (camera) {
      //Update
      const updatedCamera: Camera = {
        id: camera.id,
        name,
        username,
        password,
        stream_url,
        fall_detection_enabled: camera.fall_detection_enabled,
        inactivity_detection_enabled: camera.inactivity_detection_enabled,
        created_at: camera.created_at,
        updated_at: camera.updated_at,
      };
      (onSave as (camera: Camera) => Promise<void>)(updatedCamera);
    } else {
      //Add
      const newCamera: NewCamera = {
        name,
        username,
        password,
        stream_url,
        fall_detection_enabled: 0,
        inactivity_detection_enabled: 0,
      };
      (onSave as (camera: NewCamera) => Promise<void>)(newCamera);
    }
  };

  return (
    <View style={styles.formContainer}>
      <Text style={styles.formTitle}>
        {camera ? "Edit Camera" : "Add New Camera"}
      </Text>

      <Text style={styles.fieldTitle}>Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Camera Name"
        placeholderTextColor="#7D7D7D"
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.fieldTitle}>User Name</Text>
      <TextInput
        style={styles.input}
        placeholder="admin"
        placeholderTextColor="#7D7D7D"
        value={username}
        onChangeText={setUsername}
      />

      <Text style={styles.fieldTitle}>Password</Text>
      <TextInput
        style={styles.input}
        placeholder="••••••"
        placeholderTextColor="#7D7D7D"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Text style={styles.fieldTitle}>Stream URL</Text>
      <TextInput
        style={styles.input}
        placeholder="192.168.0.100"
        placeholderTextColor="#7D7D7D"
        value={stream_url}
        onChangeText={setStreamUrl}
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.liveFeedPlaceholder}>
        <Text style={{ color: "#888" }}>Live Feed Preview</Text>
      </View>
    </View>
  );
};
