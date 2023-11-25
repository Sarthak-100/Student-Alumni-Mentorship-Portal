import {render, screen} from '@testing-library/react';
import LoginButton from './LoginButton';

test('renders login button', () => {
  render(<LoginButton />);
});