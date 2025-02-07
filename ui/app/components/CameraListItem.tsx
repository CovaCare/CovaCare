import React from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { Camera } from "../api/types/cameraTypes";
import { styles } from "./CameraListItem.styles";

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
    <View style={styles.cameraItem}>
      <TouchableOpacity onPress={() => onSelect(camera)} style={{ flex: 1 }}>
        <Text style={styles.cameraName}>{camera.name}</Text>
        <Text style={styles.cameraDetails}>IP: {camera.stream_url}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => onDelete(camera)}
      >
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );
};
