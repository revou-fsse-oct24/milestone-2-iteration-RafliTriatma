import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginForm from '@/pages/login';
import axios from 'axios';
import { useRouter } from 'next/router';

jest.mock('axios'); // Mock axios untuk menghindari request HTTP nyata
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('LoginForm Component', () => {
  let pushMock: jest.Mock;

  beforeEach(() => {
    pushMock = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });
  });

  it('renders login form correctly', () => {
    render(<LoginForm />);
    
    expect(screen.getByLabelText(/Email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign in/i })).toBeInTheDocument();
  });

  it('updates email and password fields correctly', () => {
    render(<LoginForm />);
    
    const emailInput = screen.getByLabelText(/Email address/i) as HTMLInputElement;
    const passwordInput = screen.getByLabelText(/Password/i) as HTMLInputElement;

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
  });

  it('submits login form and redirects on success', async () => {
    (axios.post as jest.Mock).mockResolvedValue({ data: { access_token: 'mock_token' } });

    render(<LoginForm />);

    fireEvent.change(screen.getByLabelText(/Email address/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /Sign in/i }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('https://api.escuelajs.co/api/v1/auth/login', {
        email: 'test@example.com',
        password: 'password123',
      });
      expect(document.cookie).toContain('auth-token=mock_token');
      expect(pushMock).toHaveBeenCalledWith('/homepage');
    });
  });

  it('shows alert on login failure', async () => {
    jest.spyOn(window, 'alert').mockImplementation(() => {}); // Mock alert agar tidak muncul di tes

    (axios.post as jest.Mock).mockRejectedValue(new Error('Invalid credentials'));

    render(<LoginForm />);

    fireEvent.change(screen.getByLabelText(/Email address/i), { target: { value: 'wrong@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'wrongpassword' } });
    fireEvent.click(screen.getByRole('button', { name: /Sign in/i }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Invalid credentials');
    });
  });
});
