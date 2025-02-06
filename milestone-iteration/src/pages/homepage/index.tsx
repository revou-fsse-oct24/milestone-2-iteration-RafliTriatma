import { useEffect, useState } from 'react';
import Card from '@/components/Card';
import Navbar from '@/components/Navbar';

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

const Homepage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      const response = await fetch('https://api.escuelajs.co/api/v1/categories');
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      const data: Category[] = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError('Error fetching categories. Please try again later.');
    }
  };

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

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProductsByCategory(selectedCategory);
  }, [selectedCategory]);

  const handleCategoryClick = (categoryId: number | null) => {
    if (selectedCategory === categoryId) {
      return;
    }
    setSelectedCategory(categoryId);
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

export default Homepage;