import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { SliderField } from '../app/components/common/components/SliderField';
import Slider from '@react-native-community/slider';

describe('SliderField', () => {
  const mockOnValueChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const { getByText } = render(
      <SliderField
        label="Test Slider"
        value={50}
        onValueChange={mockOnValueChange}
      />
    );

    expect(getByText('Test Slider')).toBeTruthy();
  });

  it('handles value changes', () => {
    const { UNSAFE_getByType } = render(
      <SliderField
        label="Test Slider"
        value={50}
        onValueChange={mockOnValueChange}
      />
    );

    const slider = UNSAFE_getByType(Slider);
    fireEvent(slider, 'valueChange', 75);
    expect(mockOnValueChange).toHaveBeenCalledWith(75);
  });

  it('displays current value with percentage', () => {
    const { getByText } = render(
      <SliderField
        label="Test Slider"
        value={50}
        onValueChange={mockOnValueChange}
      />
    );

    expect(getByText('50%')).toBeTruthy();
  });
}); 