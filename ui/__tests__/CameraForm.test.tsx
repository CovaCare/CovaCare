import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { CameraForm } from "../app/components/CameraForm";

describe("CameraForm", () => {
  const mockOnSave = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders form fields correctly for new camera", () => {
    const { getByPlaceholderText, getByText } = render(
      <CameraForm camera={null} onSave={mockOnSave} onCancel={mockOnCancel} />
    );

    expect(getByText("Add New Camera")).toBeTruthy();
    expect(getByPlaceholderText("Enter a camera name")).toBeTruthy();
    expect(getByPlaceholderText("Enter the camera's username")).toBeTruthy();
    expect(getByPlaceholderText("Enter the camera's password")).toBeTruthy();
    expect(getByPlaceholderText("Enter the camera's IP address")).toBeTruthy();
    expect(getByText("Fall Detection")).toBeTruthy();
    expect(getByText("Inactivity Detection")).toBeTruthy();
  });

  it("validates required fields before saving", () => {
    const { getByText } = render(
      <CameraForm camera={null} onSave={mockOnSave} onCancel={mockOnCancel} />
    );

    fireEvent.press(getByText("Save"));
    expect(mockOnSave).not.toHaveBeenCalled();
  });

  it("toggles password visibility when eye icon is pressed", () => {
    const { getByPlaceholderText, getByTestId } = render(
      <CameraForm camera={null} onSave={mockOnSave} onCancel={mockOnCancel} />
    );

    const passwordInput = getByPlaceholderText("Enter the camera's password");
    const eyeIcon = getByTestId("eye-icon");

    expect(passwordInput.props.secureTextEntry).toBe(true);

    fireEvent.press(eyeIcon);
    expect(passwordInput.props.secureTextEntry).toBe(false);

    fireEvent.press(eyeIcon);
    expect(passwordInput.props.secureTextEntry).toBe(true);
  });

  it("calls onSave with correct data when form is valid", () => {
    const { getByPlaceholderText, getByText } = render(
      <CameraForm camera={null} onSave={mockOnSave} onCancel={mockOnCancel} />
    );

    fireEvent.changeText(
      getByPlaceholderText("Enter a camera name"),
      "Test Camera"
    );
    fireEvent.changeText(
      getByPlaceholderText("Enter the camera's username"),
      "admin"
    );
    fireEvent.changeText(
      getByPlaceholderText("Enter the camera's password"),
      "password123"
    );
    fireEvent.changeText(
      getByPlaceholderText("Enter the camera's IP address"),
      "123.000.123"
    );

    fireEvent.press(getByText("Save"));

    expect(mockOnSave).toHaveBeenCalledWith({
      name: "Test Camera",
      username: "admin",
      password: "password123",
      stream_url: "123.000.123",
      fall_detection_enabled: 0,
      fall_detection_start_time: "05:00",
      fall_detection_end_time: "00:00",
      inactivity_detection_enabled: 0,
      inactivity_detection_start_time: "05:00",
      inactivity_detection_end_time: "00:00",
      inactivity_detection_sensitivity: 50,
      inactivity_detection_duration: 5,
      send_image_with_alert: 0,
    });
  });

  it("pre-fills form fields when editing existing camera", () => {
    const mockCamera = {
      id: 1,
      name: "Existing Camera",
      username: "admin",
      password: "password123",
      stream_url: "123.000.123",
      fall_detection_enabled: 1 as 0 | 1,
      inactivity_detection_enabled: 0 as 0 | 1,
      fall_detection_start_time: "08:00",
      fall_detection_end_time: "20:00",
      inactivity_detection_start_time: "",
      inactivity_detection_end_time: "",
      inactivity_detection_sensitivity: 50,
      inactivity_detection_duration: 30,
      created_at: "2024-01-01",
      updated_at: "2024-01-01",
      send_image_with_alert: 1,
    };

    const { getByText, getByDisplayValue, getByTestId } = render(
      <CameraForm
        camera={mockCamera}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
      />
    );

    expect(getByText("Edit Camera")).toBeTruthy();
    expect(getByDisplayValue("Existing Camera")).toBeTruthy();
    expect(getByDisplayValue("admin")).toBeTruthy();
    expect(getByDisplayValue("password123")).toBeTruthy();
    expect(getByDisplayValue("123.000.123")).toBeTruthy();
    expect(getByTestId("fall-detection-toggle").props.value).toBe(true);
  });

  it("calls onCancel when cancel button is pressed", () => {
    const { getByText } = render(
      <CameraForm camera={null} onSave={mockOnSave} onCancel={mockOnCancel} />
    );

    fireEvent.press(getByText("Cancel"));
    expect(mockOnCancel).toHaveBeenCalled();
  });

  it("toggles detection settings correctly", () => {
    const { getByTestId, getByPlaceholderText, getByText } = render(
      <CameraForm camera={null} onSave={mockOnSave} onCancel={mockOnCancel} />
    );

    // Toggle detections
    fireEvent(getByTestId("fall-detection-toggle"), "valueChange", true);
    fireEvent(getByTestId("inactivity-detection-toggle"), "valueChange", true);

    // Set all day for both detections using Checkbox component's onValueChange
    fireEvent(getByTestId("fall-detection-all-day"), "onValueChange", true);
    fireEvent(
      getByTestId("inactivity-detection-all-day"),
      "onValueChange",
      true
    );

    // Fill in required fields
    fireEvent.changeText(
      getByPlaceholderText("Enter a camera name"),
      "Test Camera"
    );
    fireEvent.changeText(
      getByPlaceholderText("Enter the camera's username"),
      "admin"
    );
    fireEvent.changeText(
      getByPlaceholderText("Enter the camera's password"),
      "password123"
    );
    fireEvent.changeText(
      getByPlaceholderText("Enter the camera's IP address"),
      "192.111.123"
    );

    fireEvent.press(getByText("Save"));

    expect(mockOnSave).toHaveBeenCalledWith({
      name: "Test Camera",
      username: "admin",
      password: "password123",
      stream_url: "192.111.123",
      fall_detection_enabled: 1,
      fall_detection_start_time: "00:00",
      fall_detection_end_time: "00:00",
      inactivity_detection_enabled: 1,
      inactivity_detection_start_time: "00:00",
      inactivity_detection_end_time: "00:00",
      inactivity_detection_sensitivity: 50,
      inactivity_detection_duration: 5,
      send_image_with_alert: 0,
    });
  });
});
