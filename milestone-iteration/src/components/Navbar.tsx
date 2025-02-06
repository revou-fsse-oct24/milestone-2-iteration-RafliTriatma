import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface User {
  id: number;
  name: string;
  email: string;
  avatar: string;
}

const Navbar: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
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