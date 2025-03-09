import React from 'react';
import { render } from '@testing-library/react-native';
import { Card } from '../app/components/common/components/Card';
import { Text } from 'react-native';

describe('Card', () => {
  it('renders title and description correctly', () => {
    const { getByText } = render(
      <Card title="Test Title" description="Test Description">
        <Text>Child Content</Text>
      </Card>
    );

    expect(getByText('Test Title')).toBeTruthy();
    expect(getByText('Test Description')).toBeTruthy();
  });

  it('renders children correctly', () => {
    const { getByText } = render(
      <Card title="Test Title">
        <Text>Child Content</Text>
      </Card>
    );

    expect(getByText('Child Content')).toBeTruthy();
  });
}); 