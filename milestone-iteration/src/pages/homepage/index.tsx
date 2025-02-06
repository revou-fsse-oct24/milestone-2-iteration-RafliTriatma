import { useState } from 'react';
import Card from '@/components/Card';
import Navbar from '@/components/Navbar';
import { GetServerSideProps } from 'next';

interface Category {
  id: number;
  name: string;
}

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  images: string[];
}

interface HomepageProps {
  initialCategories: Category[];
  initialProducts: Product[];
  initialError: string | null;
}

const Homepage: React.FC<HomepageProps> = ({ initialCategories, initialProducts, initialError }) => {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [loading, setLoading] = useState<boolean>(false);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [error, setError] = useState<string | null>(initialError);

  const fetchProductsByCategory = async (categoryId: number | null) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        categoryId
          ? `https://api.escuelajs.co/api/v1/products/?categoryId=${categoryId}`
          : 'https://api.escuelajs.co/api/v1/products'
      );
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data: Product[] = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Error fetching products. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (categoryId: number | null) => {
    if (selectedCategory === categoryId) {
      return;
    }
    setSelectedCategory(categoryId);
    fetchProductsByCategory(categoryId);
  };

  return (
    <>
      <nav>
        <Navbar />
      </nav>
      <div>
        <div className="flex justify-center gap-4 mt-4">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className={`p-2 rounded ${
                selectedCategory === category.id ? 'bg-blue-500 text-white' : 'bg-gray-200'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <span>Loading...</span>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center">{error}</div>
        ) : (
          <div className="mt-4">
            {products.length > 0 ? (
              <Card products={products} />
            ) : (
              <p>No products found for this category.</p>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const categoryResponse = await fetch('https://api.escuelajs.co/api/v1/categories');
    if (!categoryResponse.ok) {
      throw new Error('Failed to fetch categories');
    }
    const categories: Category[] = await categoryResponse.json();

    const productResponse = await fetch('https://api.escuelajs.co/api/v1/products');
    if (!productResponse.ok) {
      throw new Error('Failed to fetch products');
    }
    const products: Product[] = await productResponse.json();

    return {
      props: {
        initialCategories: categories,
        initialProducts: products,
        initialError: null,
      },
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      props: {
        initialCategories: [],
        initialProducts: [],
        initialError: 'Error fetching data. Please try again later.',
      },
    };
  }
};

export default Homepage;