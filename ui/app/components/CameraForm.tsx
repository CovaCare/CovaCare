import { useState } from "react";
import { Alert, View, TouchableOpacity } from "react-native";
import { Camera, NewCamera } from "../api/types/cameraTypes";
import { BaseForm } from "./common/components/BaseForm";
import { FormField } from "./common/components/FormField";
import { Card } from "./common/components/Card";
import { DetectionSection } from "./common/components/DetectionSection";
import Icon from 'react-native-vector-icons/Ionicons';
import { styles } from "./common/styles/FormField.styles";

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
  const [showPassword, setShowPassword] = useState(false);

  const [fall_detection_enabled, setFallDetectionEnabled] = useState(
    camera?.fall_detection_enabled === 1
  );
  const [inactivity_detection_enabled, setInactivityDetectionEnabled] =
    useState(camera?.inactivity_detection_enabled === 1);
  const [fallDetectionStartTime, setFallDetectionStartTime] = useState(
    camera?.fall_detection_start_time || "00:00"
  );
  const [fallDetectionEndTime, setFallDetectionEndTime] = useState(
    camera?.fall_detection_end_time || "00:00"
  );
  const [inactivityDetectionStartTime, setInactivityDetectionStartTime] =
    useState(camera?.inactivity_detection_start_time || "00:00");
  const [inactivityDetectionEndTime, setInactivityDetectionEndTime] = useState(
    camera?.inactivity_detection_end_time || "00:00"
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

    if (fall_detection_enabled) {
      if (!validateTimeInputs(fallDetectionStartTime, fallDetectionEndTime)) {
        Alert.alert("Warning", "Invalid fall detection hours.");
        valid = false;
      }
    }

    if (inactivity_detection_enabled) {
      if (
        !validateTimeInputs(
          inactivityDetectionStartTime,
          inactivityDetectionEndTime
        )
      ) {
        Alert.alert("Warning", "Invalid inactivity detection hours.");
        valid = false;
      }
      if (
        parseInt(inactivityDuration, 10) > 60 ||
        parseInt(inactivityDuration, 10) < 3
      ) {
        Alert.alert(
          "Warning",
          "Time of inactivity before alert must be between 3 and 60 minutes."
        );
        valid = false;
      }
    }

    if (!valid) return;

    const cameraData = {
      ...(camera && { id: camera.id }),
      name,
      username,
      password,
      stream_url,
      fall_detection_enabled: fall_detection_enabled ? 1 : 0,
      fall_detection_start_time: fallDetectionStartTime,
      fall_detection_end_time: fallDetectionEndTime,
      inactivity_detection_enabled: inactivity_detection_enabled ? 1 : 0,
      inactivity_detection_start_time: inactivityDetectionStartTime,
      inactivity_detection_end_time: inactivityDetectionEndTime,
      inactivity_detection_sensitivity: inactivitySensitivity,
      inactivity_detection_duration: parseInt(inactivityDuration, 10),
      ...(camera && {
        created_at: camera.created_at,
        updated_at: camera.updated_at,
      }),
    };

    onSave(cameraData as any);
  };

  const validateTimeInputs = (startTime: string, endTime: string) => {
    return !(!startTime || !endTime || startTime == "" || endTime == "");
  };

  return (
    <BaseForm
      title={camera ? "Edit Camera" : "Add New Camera"}
      onSave={handleSave}
      onCancel={onCancel}
    >
      <Card title="Camera Information" description="">
        <FormField
          label="Name"
          value={name}
          onChangeText={setName}
          error={nameError}
          placeholder="Camera Name"
          infoButtonTitle={"Camera Name"}
          infoButtonMessage={
            "Enter a name for your camera. You might want to use the location where it's installed (e.g., Living Room, Front Door, Kitchen) or any other meaningful name."
          }
        />
        <FormField
          label="Username"
          value={username}
          onChangeText={setUsername}
          error={usernameError}
          placeholder="Camera Username"
        />
        <View style={{ position: 'relative' }}>
          <FormField
            label="Password"
            value={password}
            onChangeText={setPassword}
            error={passwordError}
            placeholder="Camera Password"
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Icon name={showPassword ? "eye-off" : "eye"} size={20} color="gray" />
          </TouchableOpacity>
        </View>
        <FormField
          label="IP Address"
          value={stream_url}
          onChangeText={setStreamUrl}
          error={streamUrlError}
          placeholder="192.168.0.100"
        />
      </Card>

      <DetectionSection
        title="Fall Detection"
        description=""
        enabled={fall_detection_enabled}
        onEnabledChange={setFallDetectionEnabled}
        startTime={fallDetectionStartTime}
        endTime={fallDetectionEndTime}
        onStartTimeChange={setFallDetectionStartTime}
        onEndTimeChange={setFallDetectionEndTime}
      />

      <DetectionSection
        title="Inactivity Detection"
        description=""
        enabled={inactivity_detection_enabled}
        onEnabledChange={setInactivityDetectionEnabled}
        startTime={inactivityDetectionStartTime}
        endTime={inactivityDetectionEndTime}
        onStartTimeChange={setInactivityDetectionStartTime}
        onEndTimeChange={setInactivityDetectionEndTime}
        showSensitivity={false}
        sensitivity={inactivitySensitivity}
        onSensitivityChange={setInactivitySensitivity}
        duration={inactivityDuration}
        onDurationChange={setInactivityDuration}
      />
    </BaseForm>
  );
};