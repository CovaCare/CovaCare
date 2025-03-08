import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { TimePicker } from '../app/components/common/components/TimePicker';

describe('TimePicker', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const { getByText } = render(
      <TimePicker
        label="Test Time"
        value=""
        onChange={mockOnChange}
        placeholder="Select time"
      />
    );

    expect(getByText('Test Time')).toBeTruthy();
    expect(getByText('Select time')).toBeTruthy();
  });

  it('displays selected time', () => {
    const { getByText } = render(
      <TimePicker
        label="Test Time"
        value="14:30"
        onChange={mockOnChange}
      />
    );

    expect(getByText('14:30')).toBeTruthy();
  });

  it('calls onChange when time is selected', () => {
    const { getByText, getByTestId } = render(
      <TimePicker
        label="Test Time"
        value=""
        onChange={mockOnChange}
      />
    );

    fireEvent.press(getByText('Select time'));

    const currentTime = new Date();
    const mockDate = currentTime;

    const centralStandardTime = new Date(currentTime.getTime());
    const hours = centralStandardTime.getHours();
    const minutes = centralStandardTime.getMinutes();
    const minutesString = minutes.toString().padStart(2, '0');

    fireEvent(getByTestId('dateTimePicker'), 'onChange', {
      nativeEvent: {
        eventType: 'set',
        timestamp: Date.now(),
        selectedDate: mockDate,
      },
    });

    expect(mockOnChange).toHaveBeenCalledWith(`${hours}:${minutesString}`);
  });
});
