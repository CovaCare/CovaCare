import React from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { Camera } from "../api/types/cameraTypes";
import { styles } from "./CameraListItem.styles";
import { Trash2 } from "lucide-react-native";

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
  return (
    <TouchableOpacity
      style={styles.cameraItem}
      onPress={() => onSelect(camera)}
    >
      <View style={styles.infoContainer}>
        <Text style={styles.cameraName}>{camera.name}</Text>
        <Text style={styles.cameraDetails}>{camera.stream_url}</Text>
        <View style={styles.detectionStatus}>
          <Text style={styles.statusText}>
            Fall Detection:
            <Text
              style={
                camera.fall_detection_enabled ? styles.enabled : styles.disabled
              }
            >
              {camera.fall_detection_enabled ? " Enabled" : " Disabled"}
            </Text>
          </Text>
          <Text style={styles.statusText}>
            Inactivity Detection:
            <Text
              style={
                camera.inactivity_detection_enabled
                  ? styles.enabled
                  : styles.disabled
              }
            >
              {camera.inactivity_detection_enabled ? " Enabled" : " Disabled"}
            </Text>
          </Text>
        </View>
      </View>
      <TouchableOpacity onPress={() => onDelete(camera)} testID="deleteIcon">
        <Trash2 size={25} color="gray" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};
