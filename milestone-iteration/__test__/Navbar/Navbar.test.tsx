import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Navbar from '@/components/Navbar';
import { useRouter } from 'next/router';

// Mock useRouter dari Next.js
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('Navbar Component', () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
    });
  });

  test('renders logo text', () => {
    render(<Navbar />);
    expect(screen.getByText(/LOGO/i)).toBeInTheDocument();
  });

  test('shows login link when user is not authenticated', async () => {
    render(<Navbar />);
    expect(await screen.findByText(/login/i)).toBeInTheDocument();
  });

  test('fetches and displays user data', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            id: 1,
            name: 'John Doe',
            email: 'john@example.com',
            avatar: 'https://via.placeholder.com/50',
          }),
      })
    ) as jest.Mock;

    render(<Navbar />);

    expect(await screen.findByText('John Doe')).toBeInTheDocument();
    expect(screen.getByAltText('Avatar')).toBeInTheDocument();
  });

  test('handles logout and redirects to login', async () => {
    const pushMock = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            id: 1,
            name: 'John Doe',
            email: 'john@example.com',
            avatar: 'https://via.placeholder.com/50',
          }),
      })
    ) as jest.Mock;

    render(<Navbar />);

    await waitFor(() => screen.getByText('John Doe'));

    fireEvent.click(screen.getByText(/logout/i));

    await waitFor(() => expect(pushMock).toHaveBeenCalledWith('/login'));
  });

  test('shows cart item count when there are items in the cart', () => {
    localStorage.setItem('cart', JSON.stringify([{ id: 1 }, { id: 2 }]));

    render(<Navbar />);

    expect(screen.getByText('2')).toBeInTheDocument();
  });
});
