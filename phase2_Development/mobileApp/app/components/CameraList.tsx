import React from "react";
import { FlatList, TouchableOpacity, Text } from "react-native";
import { Camera } from "../api/types/cameraTypes";
import { CameraListItem } from "./CameraListItem";
import { styles } from "../(tabs)/styles/CameraScreen.styles";

interface CameraListProps {
  cameras: Camera[];
  onCameraSelect: (camera: Camera) => void;
  onDeleteCamera: (camera: Camera) => void;
  onAddCamera: () => void;
}

export const CameraList = ({
  cameras,
  onCameraSelect,
  onDeleteCamera,
  onAddCamera,
}: CameraListProps) => {
  return (
    <FlatList
      data={cameras}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <CameraListItem
          camera={item}
          onSelect={onCameraSelect}
          onDelete={onDeleteCamera}
        />
      )}
      ListFooterComponent={
        <TouchableOpacity style={styles.addButton} onPress={onAddCamera}>
          <Text style={styles.addButtonText}>Add New Camera</Text>
        </TouchableOpacity>
      }
    />
  );
};
