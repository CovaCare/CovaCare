import React from "react";
import { TouchableOpacity, Alert } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import colors from "../../../../constants/colors";

interface InfoButtonProps {
  title: string;
  message: string;
}

export const InfoButton = ({ title, message }: InfoButtonProps) => {
  const handlePress = () => {
    Alert.alert(title, message);
  };

  return (
    <TouchableOpacity onPress={handlePress} style={{ marginLeft: 4 }}>
      <Ionicons
        name="information-circle-outline"
        size={20}
        color={colors.secondary}
      />
    </TouchableOpacity>
  );
};
