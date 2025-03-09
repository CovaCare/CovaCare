import React from "react";
import { FlatList, RefreshControl } from "react-native";
import { Camera } from "../api/types/cameraTypes";
import { CameraListItem } from "./CameraListItem";
import { AddButton } from "./common/components/AddButton";

interface CameraListProps {
  cameras: Camera[];
  onCameraSelect: (camera: Camera) => void;
  onDeleteCamera: (camera: Camera) => void;
  onAddCamera: () => void;
  refreshing?: boolean;
  onRefresh?: () => void;
}

export const CameraList = ({
  cameras,
  onCameraSelect,
  onDeleteCamera,
  onAddCamera,
  refreshing = false,
  onRefresh,
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
        <AddButton title="Add New Camera" onPress={onAddCamera} />
      }
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    />
  );
};
