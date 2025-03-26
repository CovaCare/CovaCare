import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { Alert, View } from "react-native";
import CameraScreen from "../app/(tabs)/cameras";
import ContactScreen from "../app/(tabs)/emergencyContacts";
import { apiClient } from "../app/api/apiClient";

jest.mock("../app/api/apiClient", () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

jest.spyOn(Alert, "alert");

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <View>{children}</View>
);

const mockCamera = {
  id: 1,
  name: "Tapo1",
  stream_url: "172.16.1.110",
  username: "admin",
  password: "password",
  fall_detection_enabled: 1,
  inactivity_detection_enabled: 0,
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

const mockContact = {
  id: 1,
  name: "John Doe",
  phone_number: "13061112222",
  status: 1,
  created_at: "2025-03-01",
  updated_at: "2025-03-01",
};

describe("App Integration Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (apiClient.get as jest.Mock).mockImplementation((url) => {
      if (url === "/cameras") {
        return Promise.resolve({ data: [mockCamera] });
      }
      if (url === "/contacts") {
        return Promise.resolve({ data: [mockContact] });
      }
      return Promise.reject(new Error("Not found"));
    });

    (apiClient.post as jest.Mock).mockImplementation((url, data) => {
      if (url === "/cameras") {
        return Promise.resolve({
          data: {
            ...data,
            id: 2,
            created_at: "2025-03-02",
            updated_at: "2025-03-02",
          },
        });
      }
      if (url === "/contacts") {
        return Promise.resolve({
          data: {
            ...data,
            id: 2,
            created_at: "2025-03-02",
            updated_at: "2025-03-02",
          },
        });
      }
      return Promise.reject(new Error("Not found"));
    });

    (apiClient.put as jest.Mock).mockImplementation((url, data) => {
      if (url === "/cameras/1") {
        return Promise.resolve({
          data: {
            ...data,
            id: 1,
            updated_at: "2025-03-03",
          },
        });
      }
      if (url === "/contacts/1") {
        return Promise.resolve({
          data: {
            ...data,
            id: 1,
            updated_at: "2025-03-03",
          },
        });
      }
      return Promise.reject(new Error("Not found"));
    });

    (apiClient.delete as jest.Mock).mockImplementation((url) => {
      if (url === "/cameras/1") {
        return Promise.resolve({ data: {} });
      }
      if (url === "/contacts/1") {
        return Promise.resolve({ data: {} });
      }
      return Promise.reject(new Error("Not found"));
    });
  });

  it("renders camera screen and handles camera operations", async () => {
    const { getByText, findByText, getByPlaceholderText } = render(
      <TestWrapper>
        <CameraScreen />
      </TestWrapper>
    );

    await findByText("Tapo1");
    await findByText("172.16.1.110");

    fireEvent.press(getByText("Add New Camera"));
    fireEvent.changeText(
      getByPlaceholderText("Enter a camera name"),
      "New Camera"
    );
    fireEvent.changeText(
      getByPlaceholderText("Enter the camera's username"),
      "admin"
    );
    fireEvent.changeText(
      getByPlaceholderText("Enter the camera's password"),
      "pass123"
    );
    fireEvent.changeText(
      getByPlaceholderText("Enter the camera's IP address"),
      "192.168.1.200"
    );
    fireEvent.press(getByText("Save"));

    await findByText("New Camera");
  });

  it("handles updating camera details", async () => {
    const { getByText, findByText, getByDisplayValue } = render(
      <TestWrapper>
        <CameraScreen />
      </TestWrapper>
    );

    await findByText("Tapo1");

    fireEvent.press(getByText("Tapo1"));

    await waitFor(() => {
      expect(getByDisplayValue("Tapo1")).toBeTruthy();
    });

    fireEvent.changeText(getByDisplayValue("Tapo1"), "Updated Camera");
    fireEvent.press(getByText("Save"));

    await findByText("Updated Camera");
  });

  it("renders contact screen and handles contact operations", async () => {
    const { getByText, findByText, getByPlaceholderText, getAllByText } =
      render(
        <TestWrapper>
          <ContactScreen />
        </TestWrapper>
      );

    await findByText("John Doe");
    await findByText("13061112222");

    fireEvent.press(getByText("Add New Contact"));
    fireEvent.changeText(
      getByPlaceholderText("Enter the contact's name"),
      "Jane Doe"
    );
    fireEvent.changeText(
      getByPlaceholderText("Enter the contact's phone number"),
      "13061234567"
    );
    fireEvent.press(getByText("Save"));

    await findByText("Jane Doe");
    await findByText("13061234567");
    await waitFor(() => {
      const activeElements = getAllByText("Active");
      expect(activeElements.length).toBe(2);
    });
  });

  it("handles deleting a contact", async () => {
    (apiClient.get as jest.Mock)
      .mockImplementationOnce((url) => {
        if (url === "/contacts") {
          return Promise.resolve({ data: [mockContact] });
        }
        return Promise.reject(new Error("Not found"));
      })
      .mockImplementationOnce((url) => {
        if (url === "/contacts") {
          return Promise.resolve({ data: [] });
        }
        return Promise.reject(new Error("Not found"));
      });

    const { getByTestId, queryByText, findByText } = render(
      <TestWrapper>
        <ContactScreen />
      </TestWrapper>
    );

    await findByText("John Doe");

    fireEvent.press(getByTestId("deleteIcon"));

    const lastAlertCall = (Alert.alert as jest.Mock).mock.calls.pop();
    const confirmAction = lastAlertCall[2][1].onPress;
    confirmAction();

    await waitFor(() => {
      expect(queryByText("John Doe")).toBeNull();
    });
  });
});
