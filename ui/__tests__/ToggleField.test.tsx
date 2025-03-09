import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ToggleField } from '../app/components/common/components/ToggleField';

describe('ToggleField', () => {
  const mockOnValueChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const { getByText, getByTestId } = render(
      <ToggleField
        label="Test Toggle"
        value={false}
        onValueChange={mockOnValueChange}
        testID="test-toggle"
      />
    );

    expect(getByText('Test Toggle')).toBeTruthy();
    expect(getByTestId('test-toggle')).toBeTruthy();
  });

  it('handles value changes', () => {
    const { getByTestId } = render(
      <ToggleField
        label="Test Toggle"
        value={false}
        onValueChange={mockOnValueChange}
        testID="test-toggle"
      />
    );

    fireEvent(getByTestId('test-toggle'), 'valueChange', true);
    expect(mockOnValueChange).toHaveBeenCalledWith(true);
  });

  it('displays initial value correctly', () => {
    const { getByTestId } = render(
      <ToggleField
        label="Test Toggle"
        value={true}
        onValueChange={mockOnValueChange}
        testID="test-toggle"
      />
    );

    expect(getByTestId('test-toggle').props.value).toBe(true);
  });
}); 