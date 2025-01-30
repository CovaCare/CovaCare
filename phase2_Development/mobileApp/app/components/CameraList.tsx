import React from "react";
import { FlatList } from "react-native";
import { Camera } from "../api/types/cameraTypes";
import { CameraListItem } from "./CameraListItem";

interface CameraListProps {
  cameras: Camera[];
  onCameraSelect: (camera: Camera | null) => void;
  onDeleteCamera: (camera: Camera) => void;
}

export const CameraList = ({
  cameras,
  onCameraSelect,
  onDeleteCamera,
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
    />
  );
};
