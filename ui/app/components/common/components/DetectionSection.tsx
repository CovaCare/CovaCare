import React from "react";
import { View } from "react-native";
import { Card } from "./Card";
import { TimeInputField } from "./TimeInputField";
import { SliderField } from "./SliderField";
import { FormField } from "./FormField";
import { ToggleField } from "./ToggleField";
import { styles } from "../styles/DetectionSection.styles";

interface DetectionSectionProps {
  title: string;
  description: string;
  enabled: boolean;
  onEnabledChange: (value: boolean) => void;
  startTime: string;
  endTime: string;
  onStartTimeChange: (time: string) => void;
  onEndTimeChange: (time: string) => void;
  showSensitivity?: boolean;
  sensitivity?: number;
  onSensitivityChange?: (value: number) => void;
  duration?: string;
  onDurationChange?: (value: string) => void;
}

export const DetectionSection = ({
  title,
  description,
  enabled,
  onEnabledChange,
  startTime,
  endTime,
  onStartTimeChange,
  onEndTimeChange,
  showSensitivity,
  sensitivity,
  onSensitivityChange,
  duration,
  onDurationChange,
}: DetectionSectionProps) => {
  return (
    <Card title={title} description={description}>
      <View style={styles.toggleContainer}>
        <ToggleField
          label={`${title} Enabled`}
          value={enabled}
          onValueChange={onEnabledChange}
          testID={`${title.toLowerCase().replace(" ", "-")}-toggle`}
        />
      </View>

      {enabled && (
        <>
          <TimeInputField
            label="Active Hours"
            startTime={startTime}
            endTime={endTime}
            onStartTimeChange={onStartTimeChange}
            onEndTimeChange={onEndTimeChange}
            testIDPrefix={title.toLowerCase().replace(" ", "-")}
          />

          {showSensitivity &&
            sensitivity !== undefined &&
            onSensitivityChange && (
              <SliderField
                label="Sensitivity"
                value={sensitivity}
                onValueChange={onSensitivityChange}
                info="Adjust how sensitive the system is to detecting inactivity. Higher values will trigger alerts more quickly when there is less movement."
              />
            )}

          {duration !== undefined && onDurationChange && (
            <View style={styles.durationContainer}>
              <FormField
                label="Time of Inactivity Before Alert (minutes)"
                value={duration}
                onChangeText={onDurationChange}
                keyboardType="numeric"
                placeholder="Enter duration"
              />
            </View>
          )}
        </>
      )}
    </Card>
  );
};
