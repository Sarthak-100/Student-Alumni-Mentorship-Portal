import { render, screen } from '@testing-library/react';
import LoginIconButton from './LoginIconButton';

test('renders login IconButton when user is not authenticated', () => {
  render(<LoginIconButton />);
  
  // Check if the "Log In" IconButton is rendered
  const loginIconButton = screen.getByRole('IconButton', { name: /Log In/i });
  expect(loginIconButton).toBeInTheDocument();
});

