import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Homepage from '@/pages/homepage';

const mockCategories = [
  { id: 1, name: 'Electronics' },
  { id: 2, name: 'Clothing' },
];

const mockProducts = [
  {
    id: 1,
    title: 'Laptop',
    description: 'A powerful laptop',
    price: 999,
    images: ['https://via.placeholder.com/150'],
  },
  {
    id: 2,
    title: 'T-Shirt',
    description: 'A cool t-shirt',
    price: 20,
    images: ['https://via.placeholder.com/150'],
  },
];

describe('Homepage Component', () => {
  test('renders categories and products correctly', () => {
    render(
      <Homepage
        initialCategories={mockCategories}
        initialProducts={mockProducts}
        initialError={null}
      />
    );

    // Check if category buttons are rendered
    mockCategories.forEach((category) => {
      expect(screen.getByText(category.name)).toBeInTheDocument();
    });

    // Check if products are rendered
    mockProducts.forEach((product) => {
      expect(screen.getByText(product.title)).toBeInTheDocument();
    });
  });

  test('handles category click and fetches products', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([mockProducts[0]]),
      })
    ) as jest.Mock;

    render(
      <Homepage
        initialCategories={mockCategories}
        initialProducts={mockProducts}
        initialError={null}
      />
    );

    const categoryButton = screen.getByText('Electronics');
    fireEvent.click(categoryButton);

    await waitFor(() => {
      expect(screen.getByText('Laptop')).toBeInTheDocument();
    });
  });

  test('shows loading state while fetching products', async () => {
    global.fetch = jest.fn(() =>
      new Promise((resolve) =>
        setTimeout(
          () =>
            resolve({
              ok: true,
              json: () => Promise.resolve([mockProducts[0]]),
            }),
          1000
        )
      )
    ) as jest.Mock;

    render(
      <Homepage
        initialCategories={mockCategories}
        initialProducts={mockProducts}
        initialError={null}
      />
    );

    fireEvent.click(screen.getByText('Electronics'));
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('displays error message when fetch fails', async () => {
    global.fetch = jest.fn(() => Promise.reject(new Error('Failed to fetch')));

    render(
      <Homepage
        initialCategories={mockCategories}
        initialProducts={mockProducts}
        initialError={null}
      />
    );

    fireEvent.click(screen.getByText('Electronics'));

    await waitFor(() => {
      expect(
        screen.getByText('Error fetching products. Please try again later.')
      ).toBeInTheDocument();
    });
  });
});