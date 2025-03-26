import { useState } from "react";
import { Alert, View, TouchableOpacity } from "react-native";
import { Camera, NewCamera } from "../api/types/cameraTypes";
import { BaseForm } from "./common/components/BaseForm";
import { FormField } from "./common/components/FormField";
import { Card } from "./common/components/Card";
import { DetectionSection } from "./common/components/DetectionSection";
import Icon from "react-native-vector-icons/Ionicons";
import { styles } from "./common/styles/FormField.styles";
import { ToggleField } from "./common/components/ToggleField";
import colors from "../../constants/colors";

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
    camera?.fall_detection_start_time || "05:00"
  );
  const [fallDetectionEndTime, setFallDetectionEndTime] = useState(
    camera?.fall_detection_end_time || "00:00"
  );
  const [inactivityDetectionStartTime, setInactivityDetectionStartTime] =
    useState(camera?.inactivity_detection_start_time || "05:00");
  const [inactivityDetectionEndTime, setInactivityDetectionEndTime] = useState(
    camera?.inactivity_detection_end_time || "00:00"
  );

  const [inactivitySensitivity, setInactivitySensitivity] = useState(
    camera?.inactivity_detection_sensitivity ?? 50
  );
  const [inactivityDuration, setInactivityDuration] = useState(
    camera?.inactivity_detection_duration?.toString() ?? "5"
  );
  const [send_image_with_alert, setSendImageWithAlert] = useState(
    camera?.send_image_with_alert === 1
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
        parseInt(inactivityDuration, 10) > 30 ||
        parseInt(inactivityDuration, 10) < 1
      ) {
        Alert.alert(
          "Warning",
          "Inactivity duration must be between 1 and 30 minutes."
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
      send_image_with_alert: send_image_with_alert ? 1 : 0,
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
      <Card title="General" description="">
        <FormField
          label="Name"
          value={name}
          onChangeText={setName}
          error={nameError}
          placeholder="Enter a camera name"
          infoButtonTitle={"Camera Name"}
          infoButtonMessage={
            "Enter any meaningful name for your camera (e.g., 'Living Room')"
          }
        />

        <FormField
          label="Username"
          value={username}
          onChangeText={setUsername}
          error={usernameError}
          placeholder="Enter the camera's username"
          infoButtonTitle="Camera Username"
          infoButtonMessage="Enter your camera's streaming username. This can typically be found in the user manual or as a label on the device."
        />
        <View style={{ position: "relative" }}>
          <FormField
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="Enter the camera's password"
            error={passwordError}
            secureTextEntry={!showPassword}
            infoButtonTitle="Camera Password"
            infoButtonMessage="Enter your camera's streaming password. This can typically be found in the user manual or as a label on the device."
          />
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={() => setShowPassword(!showPassword)}
            testID="eye-icon"
          >
            <Icon
              name={showPassword ? "eye-off" : "eye"}
              size={22}
              color={colors.icon.primary}
            />
          </TouchableOpacity>
        </View>
        <FormField
          label="IP Address"
          value={stream_url}
          onChangeText={setStreamUrl}
          placeholder="Enter the camera's IP address"
          error={streamUrlError}
          infoButtonTitle="Camera IP Address"
          infoButtonMessage="Enter your camera's IP address. This can be found in your router’s device list or through camera setup software."
        />
        <ToggleField
          label="Send Image with Alert"
          infoButtonTitle={"Alert Images"}
          infoButtonMessage="If this field is active, emergency alerts from this camera will contain an image of the incident."
          spaceBetween={true}
          value={send_image_with_alert}
          onValueChange={setSendImageWithAlert}
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
        infoButtonTitle="Fall Detection"
        infoButtonMessage="Activating this feature allows the system to detect falls from this camera feed."
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
        infoButtonTitle="Inactivity Detection"
        infoButtonMessage="Activating this feature allows the system to detect inactivity from this camera feed."
      />
    </BaseForm>
  );
};
