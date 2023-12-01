import { render, screen } from '@testing-library/react';
import LoginButton from './LoginButton';

test('renders login button when user is not authenticated', () => {
  render(<LoginButton />);
  
  // Check if the "Log In" button is rendered
  const loginButton = screen.getByRole('button', { name: /Log In/i });
  expect(loginButton).toBeInTheDocument();
});

