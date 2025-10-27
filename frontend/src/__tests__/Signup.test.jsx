/* eslint-disable import/first */
// React import not required with new JSX transform
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// Mock the useAuth hook to avoid provider wiring
jest.mock('../hooks/useAuth', () => ({
  useAuth: () => ({ register: jest.fn() }),
}));

import SignupPage from '../pages/SignupPage';

describe('Signup page', () => {
  it('renders the create account button', () => {
    render(
      <MemoryRouter>
        <SignupPage />
      </MemoryRouter>,
    );

    const button = screen.getByRole('button', { name: /create account/i });
    expect(button).toBeInTheDocument();
  });
});
