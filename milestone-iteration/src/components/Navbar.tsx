import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image'

interface User {
  id: number;
  name: string;
  email: string;
  avatar: string;
}

const Navbar: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [cartItemCount, setCartItemCount] = useState<number>(0);
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('https://api.escuelajs.co/api/v1/users/1');
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        const data: User = await response.json();
        setUser(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();

    const fetchCartItems = () => {
      const existingCart = localStorage.getItem('cart');
      const cart = existingCart ? JSON.parse(existingCart) : [];
      setCartItemCount(cart.length);
    };

    fetchCartItems();
  }, []);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('authToken');
    router.push('/login');
  };

  return (
    <div className='w-full bg-slate-800 py-4 px-6'>
      <div className='flex justify-between items-center'>
        {/* Logo */}
        <h1 className='text-white'>LOGO</h1>

        {/* Cart Icon */}
        <div className="relative">
          <Link href="/cart" passHref>
            <svg
              className="w-8 h-8 text-white cursor-pointer"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m0-9h12m-6 6h.01M7 21h10m-3-6h-4"
              ></path>
            </svg>
          </Link>
          {cartItemCount > 0 && (
            <span className="absolute top-0 right-0 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {cartItemCount}
            </span>
          )}
        </div>


        {/* Display Information Login */}
        {!loading && user ? (
          <div className="flex items-center gap-4">
            <span className="text-white">{user.name}</span>
            <img src={user.avatar} alt="Avatar" className="w-8 h-8 rounded-full" />
            <button
              onClick={handleLogout}
              className="text-white bg-red-600 px-4 py-2 rounded-md hover:bg-red-500"
            >
              Logout
            </button>
          </div>
        ) : (
          <Link href="/login" passHref>
            Login
          </Link>
        )}

        
      </div>
    </div>
  );
};

export default Navbar;