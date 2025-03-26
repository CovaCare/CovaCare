import React from "react";
import { Text, View, TouchableOpacity, Alert } from "react-native";
import { Camera } from "../api/types/cameraTypes";
import { styles } from "./CameraListItem.styles";
import { Trash2 } from "lucide-react-native";
import { requestHealthCheck } from "../api/services/cameraService";
import colors from "../../constants/colors";

interface CameraListItemProps {
  camera: Camera;
  onSelect: (camera: Camera) => void;
  onDelete: (camera: Camera) => void;
}

export const CameraListItem = ({
  camera,
  onSelect,
  onDelete,
}: CameraListItemProps) => {
  const handleHealthCheck = async () => {
    try {
      await requestHealthCheck(camera.id);
      Alert.alert(
        "Success",
        "A camera health check has been sent to all active contacts."
      );
    } catch (error) {
      console.error("Error requesting health check:", error);
      Alert.alert("Error", "Failed to request health check.");
    }
  };

  return (
    <TouchableOpacity
      style={styles.cameraItem}
      onPress={() => onSelect(camera)}
    >
      <View style={styles.infoContainer}>
        <Text style={styles.cameraName}>{camera.name}</Text>
        <Text style={styles.cameraDetails}>{camera.stream_url}</Text>
        <View style={styles.detectionStatus}>
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Fall Detection: </Text>
            <Text
              style={
                camera.fall_detection_enabled ? styles.enabled : styles.disabled
              }
            >
              {camera.fall_detection_enabled ? "Enabled" : "Disabled"}
            </Text>
          </View>
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Inactivity Detection: </Text>
            <Text
              style={
                camera.inactivity_detection_enabled
                  ? styles.enabled
                  : styles.disabled
              }
            >
              {camera.inactivity_detection_enabled ? "Enabled" : "Disabled"}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.testButton} onPress={handleHealthCheck}>
          <View style={styles.buttonContent}>
            <Text style={styles.buttonText}>Health Check</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onDelete(camera)} testID="deleteIcon">
          <Trash2 size={25} color={colors.icon.primary} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};
