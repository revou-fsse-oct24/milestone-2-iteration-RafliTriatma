import axios from 'axios';

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  images: string[];
}

export const fetchProduct = async (): Promise<Product[]> => {
  try {
    const response = await axios.get<Product[]>('https://api.escuelajs.co/api/v1/products');
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch products');
  }
};
