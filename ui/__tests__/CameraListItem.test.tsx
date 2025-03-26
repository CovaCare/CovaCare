import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { CameraListItem } from "../app/components/CameraListItem";

describe("CameraListItem", () => {
  const mockCamera = {
    id: 1,
    name: "Living Room Camera",
    username: "admin",
    password: "password",
    stream_url: "198.123.456.12",
    fall_detection_enabled: 1 as 0 | 1,
    inactivity_detection_enabled: 0 as 0 | 1,
    fall_detection_start_time: "08:00",
    fall_detection_end_time: "20:00",
    inactivity_detection_start_time: "",
    inactivity_detection_end_time: "",
    inactivity_detection_sensitivity: 50,
    inactivity_detection_duration: 30,
    created_at: "2025-03-01",
    updated_at: "2025-03-01",
    send_image_with_alert: 0,
  };

  const mockOnSelect = jest.fn();
  const mockOnDelete = jest.fn();

  it("renders camera information correctly", () => {
    const { getByText } = render(
      <CameraListItem
        camera={mockCamera}
        onSelect={mockOnSelect}
        onDelete={mockOnDelete}
      />
    );

    expect(getByText("Living Room Camera")).toBeTruthy();
    expect(getByText("198.123.456.12")).toBeTruthy();
    expect(getByText("Enabled")).toBeTruthy();
    expect(getByText("Disabled")).toBeTruthy();
  });

  it("calls onSelect when camera is pressed", () => {
    const { getByText } = render(
      <CameraListItem
        camera={mockCamera}
        onSelect={mockOnSelect}
        onDelete={mockOnDelete}
      />
    );

    fireEvent.press(getByText("Living Room Camera"));
    expect(mockOnSelect).toHaveBeenCalledWith(mockCamera);
  });

  it("calls onDelete when delete button is pressed", () => {
    const { getByTestId } = render(
      <CameraListItem
        camera={mockCamera}
        onSelect={mockOnSelect}
        onDelete={mockOnDelete}
      />
    );

    fireEvent.press(getByTestId("deleteIcon"));
    expect(mockOnDelete).toHaveBeenCalledWith(mockCamera);
  });
});
