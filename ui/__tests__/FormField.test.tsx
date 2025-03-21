import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { FormField } from '../app/components/common/components/FormField';
import colors from '../constants/colors';

describe('FormField', () => {
  const mockOnChangeText = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const { getByText, getByPlaceholderText } = render(
      <FormField
        label="Test Field"
        value=""
        onChangeText={mockOnChangeText}
        placeholder="Enter value"
      />
    );

    expect(getByText('Test Field')).toBeTruthy();
    expect(getByPlaceholderText('Enter value')).toBeTruthy();
  });

  it('handles text changes', () => {
    const { getByPlaceholderText } = render(
      <FormField
        label="Test Field"
        value=""
        onChangeText={mockOnChangeText}
        placeholder="Enter value"
      />
    );

    fireEvent.changeText(getByPlaceholderText('Enter value'), 'test input');
    expect(mockOnChangeText).toHaveBeenCalledWith('test input');
  });

  it('displays error state correctly', () => {
    const { getByPlaceholderText } = render(
      <FormField
        label="Test Field"
        value=""
        onChangeText={mockOnChangeText}
        placeholder="Enter value"
        error={true}
      />
    );

    const input = getByPlaceholderText('Enter value');
    expect(input.props.style).toContainEqual(expect.objectContaining({ borderColor: colors.status.error }));
  });

  it('handles secure text entry', () => {
    const { getByPlaceholderText } = render(
      <FormField
        label="Password"
        value=""
        onChangeText={mockOnChangeText}
        placeholder="Enter password"
        secureTextEntry={true}
      />
    );

    expect(getByPlaceholderText('Enter password').props.secureTextEntry).toBe(true);
  });
}); 