import { useState } from "react";
import { View } from "react-native";
import { Camera, NewCamera } from "../api/types/cameraTypes";
import { BaseForm } from "./common/components/BaseForm";
import { FormField } from "./common/components/FormField";
import { ToggleField } from "./common/components/ToggleField";
import { TimeInputField } from "./common/components/TimeInputField";
import { SliderField } from "./common/components/SliderField";

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

    const cameraData = {
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

    if (camera) {
      (onSave as (camera: Camera) => Promise<void>)({
        ...cameraData,
        id: camera.id,
        created_at: camera.created_at,
        updated_at: camera.updated_at,
      });
    } else {
      (onSave as (camera: NewCamera) => Promise<void>)(cameraData);
    }
  };

  return (
    <BaseForm
      title={camera ? "Edit Camera" : "Add New Camera"}
      onSave={handleSave}
      onCancel={onCancel}
    >
      <FormField
        label="Name"
        value={name}
        onChangeText={setName}
        error={nameError}
        placeholder="Enter camera name"
        maxLength={50}
      />

      <FormField
        label="Username"
        value={username}
        onChangeText={setUsername}
        error={usernameError}
        placeholder="Enter username"
      />

      <FormField
        label="Password"
        value={password}
        onChangeText={setPassword}
        error={passwordError}
        placeholder="Enter password"
        secureTextEntry
      />

      <FormField
        label="Stream URL"
        value={stream_url}
        onChangeText={setStreamUrl}
        error={streamUrlError}
        placeholder="Enter camera IP"
      />

      <ToggleField
        label="Fall Detection Enabled"
        value={fall_detection_enabled}
        onValueChange={setFallDetectionEnabled}
      />

      {fall_detection_enabled && (
        <TimeInputField
          label="Fall Detection Active Hours"
          startTime={fallDetectionStartTime}
          endTime={fallDetectionEndTime}
          onStartTimeChange={setFallDetectionStartTime}
          onEndTimeChange={setFallDetectionEndTime}
        />
      )}

      <ToggleField
        label="Inactivity Detection Enabled"
        value={inactivity_detection_enabled}
        onValueChange={setInactivityDetectionEnabled}
      />

      {inactivity_detection_enabled && (
        <View>
          <TimeInputField
            label="Inactivity Detection Hours"
            startTime={inactivityDetectionStartTime}
            endTime={inactivityDetectionEndTime}
            onStartTimeChange={setInactivityDetectionStartTime}
            onEndTimeChange={setInactivityDetectionEndTime}
          />

          <SliderField
            label="Sensitivity"
            value={inactivitySensitivity}
            onValueChange={setInactivitySensitivity}
          />

          <FormField
            label="Duration (minutes)"
            value={inactivityDuration}
            onChangeText={setInactivityDuration}
            keyboardType="numeric"
          />
        </View>
      )}
    </BaseForm>
  );
};