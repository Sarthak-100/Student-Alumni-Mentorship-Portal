// ProfileDisplay.test.js
import React from 'react';
import { render, screen, } from '@testing-library/react';
import ProfileDisplay from './ProfileDisplay';

test('renders profile dialog with email Id as passed when open is true', () => {
  const userData = {
    name: 'John Doe',
    email: 'john@example.com',
    work: { role: 'Engineer', organization: 'ABC Inc.' },
    branch: 'Computer Science',
    batch: '2020',
    location: { city: 'City', state: 'State', country: 'Country' },
  };

  render(<ProfileDisplay open={true} onClose={() => {}} userData={userData} />);
  
  const emailRegex = /Email:\s+john@example.com/;
  const emailElement = screen.getByText((content, element) => {
    // Check if the content matches the regular expression
    const hasText = (node) => node.textContent.match(emailRegex);
    const elementHasText = hasText(element);
    const childrenDontHaveText = Array.from(element.children).every((child) => !hasText(child));

    return elementHasText && childrenDontHaveText;
  });

  expect(emailElement).toBeInTheDocument();

});