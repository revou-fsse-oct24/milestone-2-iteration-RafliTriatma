import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import Card from '@/components/Card';
import { useRouter } from 'next/router';

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  images: string[];
  quantity?: number;
}

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('Card Component', () => {
  const products: Product[] = [
    {
      id: 1,
      title: 'Product 1',
      description: 'Description 1',
      price: 100,
      images: ['https://via.placeholder.com/150'],
    },
  ];

  const mockRouter = {
    push: jest.fn(),
  };

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    localStorage.clear();
  });

  it('renders products correctly', () => {
    render(<Card products={products} />);

    expect(screen.getByText('Product 1')).toBeInTheDocument();
    expect(screen.getByText('Description 1')).toBeInTheDocument();
    expect(screen.getByText('$100')).toBeInTheDocument();
  });

  it('redirects to product detail page on card click', () => {
    render(<Card products={products} />);

    fireEvent.click(screen.getByText('Product 1'));

    expect(mockRouter.push).toHaveBeenCalledWith('/product/1');
  });

  it('adds product to cart and shows notification', () => {
    render(<Card products={products} />);

    fireEvent.click(screen.getByText('Add to Cart'));

    expect(localStorage.getItem('cart')).toBe(
      JSON.stringify([{ ...products[0], quantity: 1 }])
    );
    expect(screen.getByText('Product added to cart')).toBeInTheDocument();
  });

  it('increments product quantity if already in cart', () => {
    localStorage.setItem('cart', JSON.stringify([{ ...products[0], quantity: 1 }]));

    render(<Card products={products} />);

    fireEvent.click(screen.getByText('Add to Cart'));

    expect(localStorage.getItem('cart')).toBe(
      JSON.stringify([{ ...products[0], quantity: 2 }])
    );
  });
});