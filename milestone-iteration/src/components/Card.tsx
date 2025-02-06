import { useRouter } from 'next/router';

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  images: string[];
}

interface CardProps {
  products: Product[];
}

const Card: React.FC<CardProps> = ({ products }) => {
  const router = useRouter();

  const addToCart = (product: Product) => {
    const existingCart = localStorage.getItem('cart');
    const cart = existingCart ? JSON.parse(existingCart) : [];

    const existingProductIndex = cart.findIndex((item: Product) => item.id === product.id);
    if (existingProductIndex !== -1) {
      cart[existingProductIndex].quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));

    router.push('/cart'); // Redirect to the Cart page
  };

  const handleCardClick = (productId: number) => {
    router.push(`/product/${productId}`);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
      {products.map((product) => (
        <div
          key={product.id}
          className="w-full h-[400px] flex flex-col border border-gray-300 rounded-lg shadow-lg overflow-hidden cursor-pointer"
          onClick={() => handleCardClick(product.id)}
        >
          <img
            src={product.images[0]}
            alt={product.title}
            className="w-full h-48 object-cover rounded-t-lg"
          />

          <div className="flex flex-col p-4 flex-1">
            <h3 className="text-xl font-semibold text-gray-800 truncate">{product.title}</h3>
            <p className="mt-2 text-sm text-gray-600 line-clamp-3">{product.description}</p>

            {/* Product Price */}
            <p className="mt-2 text-lg font-bold text-gray-900">${product.price}</p>

            {/* Add to Cart Button */}
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevent parent onClick
                addToCart(product);
              }}
              className="mt-auto w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-500"
            >
              Add to Cart
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Card;