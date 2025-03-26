import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { ContactListItem } from "../app/components/ContactListItem";

describe("ContactListItem", () => {
  const mockContact = {
    id: 1,
    name: "John Doe",
    phone_number: "3061234567",
    status: 1 as 0 | 1,
    created_at: "2025-03-01",
    updated_at: "2025-03-01",
  };

  const mockOnSelect = jest.fn();
  const mockOnDelete = jest.fn();

  it("renders contact information correctly", () => {
    const { getByText } = render(
      <ContactListItem
        contact={mockContact}
        onSelect={mockOnSelect}
        onDelete={mockOnDelete}
      />
    );

    expect(getByText("John Doe")).toBeTruthy();
    expect(getByText("306-123-4567")).toBeTruthy();
    expect(getByText("Active")).toBeTruthy();
  });

  it("calls onSelect when contact is pressed", () => {
    const { getByText } = render(
      <ContactListItem
        contact={mockContact}
        onSelect={mockOnSelect}
        onDelete={mockOnDelete}
      />
    );

    fireEvent.press(getByText("John Doe"));
    expect(mockOnSelect).toHaveBeenCalledWith(mockContact);
  });

  it("calls onDelete when delete button is pressed", () => {
    const { getByTestId } = render(
      <ContactListItem
        contact={mockContact}
        onSelect={mockOnSelect}
        onDelete={mockOnDelete}
      />
    );

    fireEvent.press(getByTestId("deleteIcon"));
    expect(mockOnDelete).toHaveBeenCalledWith(mockContact);
  });

  it('renders "Inactive" when status is 0', () => {
    const inactiveContact = { ...mockContact, status: 0 as 0 | 1 };

    const { getByText } = render(
      <ContactListItem
        contact={inactiveContact}
        onSelect={mockOnSelect}
        onDelete={mockOnDelete}
      />
    );

    expect(getByText("Inactive")).toBeTruthy();
  });
});
