import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  images: string[];
  quantity: number;
}

const Cart: React.FC = () => {
  const [cart, setCart] = useState<Product[]>([]);
  const router = useRouter();

  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  const increaseQuantity = (id: number) => {
    const updatedCart = cart.map((product) =>
      product.id === id ? { ...product, quantity: product.quantity + 1 } : product
    );
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const decreaseQuantity = (id: number) => {
    const updatedCart = cart.map((product) =>
      product.id === id && product.quantity > 1
        ? { ...product, quantity: product.quantity - 1 }
        : product
    );
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const removeFromCart = (id: number) => {
    const updatedCart = cart.filter((product) => product.id !== id);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const handleCheckout = () => {
    router.push('/checkout');
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Shopping Cart</h2>

      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {cart.map((product) => (
            <div key={product.id} className="border border-gray-300 rounded-lg p-4">
              <img
                src={product.images[0]}
                alt={product.title}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <h3 className="text-lg font-semibold mt-2">{product.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{product.description}</p>
              <p className="text-lg font-bold text-gray-900 mt-2">${product.price}</p>

              {/* Display Quantity */}
              <div className="flex items-center gap-2 mt-3">
                <button
                  onClick={() => decreaseQuantity(product.id)}
                  className="bg-gray-200 px-2 py-1 rounded-full"
                >
                  -
                </button>
                <span>{product.quantity}</span>
                <button
                  onClick={() => increaseQuantity(product.id)}
                  className="bg-gray-200 px-2 py-1 rounded-full"
                >
                  +
                </button>
              </div>

              {/* Button Remove from Cart */}
              <button
                onClick={() => removeFromCart(product.id)}
                className="mt-2 text-red-600 hover:text-red-500"
              >
                Remove from Cart
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Checkout Button */}
      {cart.length > 0 && (
        <div className="mt-6">
          <button
            onClick={handleCheckout}
            className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-500"
          >
            Checkout
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;