import React from 'react';
import { render, screen } from '@testing-library/react';
import MainLayout from './MainLayout';

test('renders learn react link', () => {
  render(<MainLayout />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
