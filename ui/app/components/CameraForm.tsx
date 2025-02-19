import { useState } from "react";
import { View } from "react-native";
import { Camera, NewCamera } from "../api/types/cameraTypes";
import { BaseForm } from "./common/components/BaseForm";
import { FormField } from "./common/components/FormField";
import { Card } from "./common/components/Card";
import { DetectionSection } from "./common/components/DetectionSection";

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

  return (
    <BaseForm
      title={camera ? "Edit Camera" : "Add New Camera"}
      onSave={handleSave}
      onCancel={onCancel}
    >
      <Card 
        title="Camera Details" 
        description="Enter the basic information for your camera"
      >
        <FormField
          label="Name"
          value={name}
          onChangeText={setName}
          error={nameError}
          placeholder="Camera Name"
        />
        <FormField
          label="Username"
          value={username}
          onChangeText={setUsername}
          error={usernameError}
          placeholder="Camera Username"
        />
        <FormField
          label="Password"
          value={password}
          onChangeText={setPassword}
          error={passwordError}
          placeholder="Camera Password"
          secureTextEntry
        />
        <FormField
          label="Stream URL"
          value={stream_url}
          onChangeText={setStreamUrl}
          error={streamUrlError}
          placeholder="192.168.0.100"
        />
      </Card>

      <DetectionSection
        title="Fall Detection"
        description="Configure fall detection settings"
        enabled={fall_detection_enabled}
        onEnabledChange={setFallDetectionEnabled}
        startTime={fallDetectionStartTime}
        endTime={fallDetectionEndTime}
        onStartTimeChange={setFallDetectionStartTime}
        onEndTimeChange={setFallDetectionEndTime}
      />

      <DetectionSection
        title="Inactivity Detection"
        description="Configure inactivity monitoring settings"
        enabled={inactivity_detection_enabled}
        onEnabledChange={setInactivityDetectionEnabled}
        startTime={inactivityDetectionStartTime}
        endTime={inactivityDetectionEndTime}
        onStartTimeChange={setInactivityDetectionStartTime}
        onEndTimeChange={setInactivityDetectionEndTime}
        showSensitivity={true}
        sensitivity={inactivitySensitivity}
        onSensitivityChange={setInactivitySensitivity}
        duration={inactivityDuration}
        onDurationChange={setInactivityDuration}
      />
    </BaseForm>
  );
};