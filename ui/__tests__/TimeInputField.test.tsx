import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { TimeInputField } from '../app/components/common/components/TimeInputField';

describe('TimeInputField', () => {
  const mockStartTimeChange = jest.fn();
  const mockEndTimeChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with empty times', () => {
    const { getByText } = render(
      <TimeInputField
        label="Active Hours"
        startTime=""
        endTime=""
        onStartTimeChange={mockStartTimeChange}
        onEndTimeChange={mockEndTimeChange}
      />
    );

    expect(getByText('Active Hours')).toBeTruthy();
    expect(getByText('Start Time')).toBeTruthy();
    expect(getByText('End Time')).toBeTruthy();
    expect(getByText('All Day')).toBeTruthy();
  });

  it('handles all day toggle correctly', () => {
    const { getByText } = render(
      <TimeInputField
        label="Active Hours"
        startTime=""
        endTime=""
        onStartTimeChange={mockStartTimeChange}
        onEndTimeChange={mockEndTimeChange}
      />
    );

    fireEvent(getByText('All Day'), 'onValueChange', true);
    expect(mockStartTimeChange).toHaveBeenCalledWith('00:00');
    expect(mockEndTimeChange).toHaveBeenCalledWith('23:59');
  });

  it('displays correct times when provided', () => {
    const { getByText } = render(
      <TimeInputField
        label="Active Hours"
        startTime="08:00"
        endTime="17:00"
        onStartTimeChange={mockStartTimeChange}
        onEndTimeChange={mockEndTimeChange}
      />
    );

    expect(getByText('08:00')).toBeTruthy();
    expect(getByText('17:00')).toBeTruthy();
  });
});
