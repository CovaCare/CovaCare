import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { DetectionSection } from "../app/components/common/components/DetectionSection";

describe("DetectionSection", () => {
  const mockProps = {
    title: "Fall Detection",
    description: "Configure fall detection settings",
    enabled: false,
    onEnabledChange: jest.fn(),
    startTime: "",
    endTime: "",
    onStartTimeChange: jest.fn(),
    onEndTimeChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders basic fields correctly", () => {
    const { getByText, getByTestId } = render(
      <DetectionSection {...mockProps} />
    );

    expect(getByText("Fall Detection")).toBeTruthy();
    expect(getByText("Configure fall detection settings")).toBeTruthy();
    expect(getByTestId("fall-detection-toggle")).toBeTruthy();
  });

  it("shows time inputs when enabled", () => {
    const { getByText, rerender } = render(<DetectionSection {...mockProps} />);

    rerender(<DetectionSection {...mockProps} enabled={true} />);
    expect(getByText("Active Hours")).toBeTruthy();
  });

  it("shows sensitivity slider when specified", () => {
    const { getByText } = render(
      <DetectionSection
        {...mockProps}
        enabled={true}
        showSensitivity={true}
        sensitivity={50}
        onSensitivityChange={jest.fn()}
      />
    );

    expect(getByText("Sensitivity")).toBeTruthy();
  });

  it("shows duration field when specified", () => {
    const { getByText } = render(
      <DetectionSection
        {...mockProps}
        enabled={true}
        duration="30"
        onDurationChange={jest.fn()}
      />
    );

    expect(getByText("Time of Inactivity Before Alert (minutes)")).toBeTruthy();
  });
});
