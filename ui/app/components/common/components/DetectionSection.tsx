import React from "react";
import { View } from "react-native";
import { Card } from "./Card";
import { TimeInputField } from "./TimeInputField";
import { SliderField } from "./SliderField";
import { FormField } from "./FormField";
import { ToggleField } from "./ToggleField";

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
      <ToggleField
        label={`${title} Enabled`}
        value={enabled}
        onValueChange={onEnabledChange}
      />
      
      {enabled && (
        <>
          <TimeInputField
            label="Active Hours"
            startTime={startTime}
            endTime={endTime}
            onStartTimeChange={onStartTimeChange}
            onEndTimeChange={onEndTimeChange}
          />
          
          {showSensitivity && sensitivity !== undefined && onSensitivityChange && (
            <SliderField
              label="Sensitivity"
              value={sensitivity}
              onValueChange={onSensitivityChange}
              info="Adjust how sensitive the system is to detecting inactivity. Higher values will trigger alerts more quickly when there is less movement."
            />
          )}
          
          {duration !== undefined && onDurationChange && (
            <FormField
              label="Duration (minutes)"
              value={duration}
              onChangeText={onDurationChange}
              keyboardType="numeric"
              placeholder="Enter duration"
            />
          )}
        </>
      )}
    </Card>
  );
}; 
