import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { ContactForm } from "../app/components/ContactForm";

describe("ContactForm", () => {
  const mockOnSave = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders form fields correctly for new contact", () => {
    const { getByPlaceholderText, getByText } = render(
      <ContactForm contact={null} onSave={mockOnSave} onCancel={mockOnCancel} />
    );

    expect(getByPlaceholderText("Enter the contact's name")).toBeTruthy();
    expect(
      getByPlaceholderText("Enter the contact's phone number")
    ).toBeTruthy();
    expect(getByText("Active")).toBeTruthy();
  });

  it("validates required fields before saving", () => {
    const { getByText } = render(
      <ContactForm contact={null} onSave={mockOnSave} onCancel={mockOnCancel} />
    );

    fireEvent.press(getByText("Save"));
    expect(mockOnSave).not.toHaveBeenCalled();
  });

  it("calls onSave with correct data when form is valid", () => {
    const { getByPlaceholderText, getByText } = render(
      <ContactForm contact={null} onSave={mockOnSave} onCancel={mockOnCancel} />
    );

    fireEvent.changeText(
      getByPlaceholderText("Enter the contact's name"),
      "John Doe"
    );
    fireEvent.changeText(
      getByPlaceholderText("Enter the contact's phone number"),
      "3061234567"
    );
    fireEvent.press(getByText("Save"));

    expect(mockOnSave).toHaveBeenCalledWith({
      name: "John Doe",
      phone_number: "3061234567",
      status: 1,
    });
  });

  it("pre-fills form fields when editing an existing contact", () => {
    const existingContact = {
      id: 1,
      name: "Jane Doe",
      phone_number: "9876543210",
      status: 1 as 0 | 1,
    };

    const { getByPlaceholderText, getByText } = render(
      <ContactForm
        contact={existingContact}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
      />
    );

    expect(getByPlaceholderText("Enter the contact's name").props.value).toBe(
      "Jane Doe"
    );
    expect(
      getByPlaceholderText("Enter the contact's phone number").props.value
    ).toBe("9876543210");
    expect(getByText("Active")).toBeTruthy();
  });
});
