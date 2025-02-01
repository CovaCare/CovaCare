import { useState } from "react";
import { Camera, NewCamera } from "../api/types/cameraTypes";
import { Text, View, TouchableOpacity, Switch, TextInput } from "react-native";
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
  const [fall_detection_enabled, setFallDetectionEnabled] = useState(
    camera?.fall_detection_enabled === 1
  );
  const [inactivity_detection_enabled, setInactivityDetectionEnabled] = useState(
    camera?.inactivity_detection_enabled === 1
  );

  const [nameError, setNameError] = useState<boolean>(false);
  const [usernameError, setUsernameError] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<boolean>(false);
  const [streamUrlError, setStreamUrlError] = useState<boolean>(false);

  const handleSave = () => {
    setNameError(false);
    setUsernameError(false);
    setPasswordError(false);
    setStreamUrlError(false);

    let valid = true;

    if (name.trim() === "") {
      setNameError(true);
      valid = false;
    }
    if (username.trim() === "") {
      setUsernameError(true);
      valid = false;
    }
    if (password === "") {
      setPasswordError(true);
      valid = false;
    }
    if (stream_url.trim() === "") {
      setStreamUrlError(true);
      valid = false;
    }

    if (!valid) return;

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
        style={[styles.input, nameError && styles.inputError]}
        placeholder="Camera Name"
        placeholderTextColor="#7D7D7D"
        value={name}
        maxLength={50}
        onChangeText={(text) => {
          setName(text);
          if (text.trim() !== "") setNameError(false);
        }}
      />

      <Text style={styles.fieldTitle}>User Name</Text>
      <TextInput
        style={[styles.input, usernameError && styles.inputError]}
        placeholder="admin"
        placeholderTextColor="#7D7D7D"
        value={username}
        onChangeText={(text) => {
          setUsername(text);
          if (text.trim() !== "") setUsernameError(false);
        }}
      />

      <Text style={styles.fieldTitle}>Password</Text>
      <TextInput
        style={[styles.input, passwordError && styles.inputError]}
        placeholder="••••••"
        placeholderTextColor="#7D7D7D"
        secureTextEntry
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          if (text !== "") setPasswordError(false);
        }}
      />

      <Text style={styles.fieldTitle}>Stream URL</Text>
      <TextInput
        style={[styles.input, streamUrlError && styles.inputError]}
        placeholder="192.168.0.100"
        placeholderTextColor="#7D7D7D"
        value={stream_url}
        onChangeText={(text) => {
          setStreamUrl(text);
          if (text.trim() !== "") setStreamUrlError(false);
        }}
      />

      <View style={styles.switchContainer}>
        <Text>Fall Detection Enabled</Text>
        <Switch
          value={fall_detection_enabled}
          onValueChange={setFallDetectionEnabled}
        />
      </View>

      <View style={styles.switchContainer}>
        <Text>Inactivity Detection Enabled</Text>
        <Switch
          value={inactivity_detection_enabled}
          onValueChange={setInactivityDetectionEnabled}
        />
      </View>

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
