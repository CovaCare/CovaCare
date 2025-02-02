import { useState } from "react";
import { Camera, NewCamera } from "../api/types/cameraTypes";
import { Text, View, TouchableOpacity, Switch, TextInput, ScrollView } from "react-native";
import Slider from "@react-native-community/slider";
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
  const [inactivity_detection_enabled, setInactivityDetectionEnabled] =
    useState(camera?.inactivity_detection_enabled === 1);
  const [fallDetectionStartTime, setFallDetectionStartTime] = useState(
    camera?.fall_detection_start_time || ""
  );
  const [fallDetectionEndTime, setFallDetectionEndTime] = useState(
    camera?.fall_detection_end_time || ""
  );
  const [inactivityDetectionStartTime, setInactivityDetectionStartTime] =
    useState(camera?.inactivity_detection_start_time || "");
  const [inactivityDetectionEndTime, setInactivityDetectionEndTime] = useState(
    camera?.inactivity_detection_end_time || ""
  );

  const [inactivitySensitivity, setInactivitySensitivity] = useState(
    camera?.inactivity_detection_sensitivity ?? 50
  );
  const [inactivityDuration, setInactivityDuration] = useState(
    camera?.inactivity_detection_duration?.toString() ?? "30"
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
        fall_detection_enabled: fall_detection_enabled ? 1 : 0,
        inactivity_detection_enabled: inactivity_detection_enabled ? 1 : 0,
        fall_detection_start_time: fallDetectionStartTime,
        fall_detection_end_time: fallDetectionEndTime,
        inactivity_detection_start_time: inactivityDetectionStartTime,
        inactivity_detection_end_time: inactivityDetectionEndTime,
        inactivity_detection_sensitivity: inactivitySensitivity,
        inactivity_detection_duration: parseInt(inactivityDuration, 10),
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
        fall_detection_enabled: fall_detection_enabled ? 1 : 0,
        inactivity_detection_enabled: inactivity_detection_enabled ? 1 : 0,
        fall_detection_start_time: fallDetectionStartTime,
        fall_detection_end_time: fallDetectionEndTime,
        inactivity_detection_start_time: inactivityDetectionStartTime,
        inactivity_detection_end_time: inactivityDetectionEndTime,
        inactivity_detection_sensitivity: inactivitySensitivity,
        inactivity_detection_duration: parseInt(inactivityDuration, 10),
      };
      (onSave as (camera: NewCamera) => Promise<void>)(newCamera);
    }
  };

  return (
    <View style={styles.outerContainer}>
      <View style={styles.headerContainer}>
        <Text style={styles.formTitle}>
          {camera ? "Edit Camera" : "Add New Camera"}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
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

        {fall_detection_enabled && (
          <View style={styles.detectionSection}>
            <Text style={styles.detectionHeader}>
              Fall Detection Active Hours
            </Text>
            <View style={styles.timeRow}>
              <Text>Start Time</Text>
              <TextInput
                style={styles.timeInput}
                value={fallDetectionStartTime}
                onChangeText={setFallDetectionStartTime}
                placeholder="HH:MM"
              />
              <Text>End Time</Text>
              <TextInput
                style={styles.timeInput}
                value={fallDetectionEndTime}
                onChangeText={setFallDetectionEndTime}
                placeholder="HH:MM"
              />
            </View>
          </View>
        )}

        <View style={styles.switchContainer}>
          <Text>Inactivity Detection Enabled</Text>
          <Switch
            value={inactivity_detection_enabled}
            onValueChange={setInactivityDetectionEnabled}
          />
        </View>

        {inactivity_detection_enabled && (
          <View style={styles.detectionSection}>
            <Text style={styles.detectionHeader}>
              Inactivity Detection Settings
            </Text>

            <View style={styles.timeRow}>
              <Text>Start Time</Text>
              <TextInput
                style={styles.timeInput}
                value={inactivityDetectionStartTime}
                onChangeText={setInactivityDetectionStartTime}
                placeholder="HH:MM"
              />
              <Text>End Time</Text>
              <TextInput
                style={styles.timeInput}
                value={inactivityDetectionEndTime}
                onChangeText={setInactivityDetectionEndTime}
                placeholder="HH:MM"
              />
            </View>

            <View style={styles.sliderRow}>
              <Text style={styles.sliderLabel}>Sensitivity:</Text>
              <Slider
                style={{ flex: 1 }}
                minimumValue={0}
                maximumValue={100}
                step={1}
                value={inactivitySensitivity}
                onValueChange={(val) => setInactivitySensitivity(val)}
              />
              <Text>{inactivitySensitivity}%</Text>
            </View>

            <View style={styles.sliderRow}>
              <Text>Duration (min):</Text>
              <TextInput
                style={styles.durationInput}
                value={inactivityDuration}
                onChangeText={setInactivityDuration}
                keyboardType="numeric"
              />
            </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
