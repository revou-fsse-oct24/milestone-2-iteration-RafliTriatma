import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  images: string[];
}

const DetailProduct: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProductDetail = async () => {
      if (!id) return;

      try {
        console.log(`Fetching product details for ID: ${id}`);
        const productId = Number(id);
        if (isNaN(productId)) {
          setError('Invalid product ID');
          setLoading(false);
          return;
        }

        const response = await fetch(`https://api.escuelajs.co/api/v1/products/${productId}`);

        if (!response.ok) {
          throw new Error('Product not found');
        }

        const data: Product = await response.json();
        console.log('Product data:', data);
        setProduct(data);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error fetching product details';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetail();
  }, [id]);
  
  const addToCart = (product: Product) => {
    const existingCart = localStorage.getItem('cart');
    const cart = existingCart ? JSON.parse(existingCart) : [];

    cart.push(product);

    localStorage.setItem('cart', JSON.stringify(cart));

    router.push('/cart');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>     
      <div className="flex flex-col items-center p-6">
        {product && (
          <div className="max-w-md w-full bg-white shadow-md rounded-lg overflow-hidden">
            <div className="w-full h-64">
              <img
                src={product.images[0] || 'fallback-image-url.jpg'}
                alt={product.title}
                className="w-full h-64 object-contain"
              />
            </div>
            <div className="p-4">
              <h2 className="text-2xl font-semibold text-gray-800">{product.title}</h2>
              <p className="mt-2 text-gray-600">{product.description}</p>
              <p className="mt-4 text-lg font-bold text-gray-900">${product.price.toFixed(2)}</p>
            </div>
            <button 
              onClick={(e) => {
                e.stopPropagation(); 
                addToCart(product);
              }}
              className="mt-auto w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-500"
            >
              Add to Cart
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default DetailProduct;