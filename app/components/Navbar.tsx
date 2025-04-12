// components/Navbar.tsx
'use client';
import Link from 'next/link';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/navigation';

interface DecodedToken {
  userDetail: {
    _id: string;
    email?: string;
    name?: string;
    mobile_no?: number;
  };
}

export default function Navbar() {
  const router = useRouter();
  const userToken = typeof window !== 'undefined' ? localStorage.getItem('userToken') : null;
  const user = userToken ? jwtDecode<DecodedToken>(userToken) : null;

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    router.push('/login');
  };

  return (
    <nav className="bg-gray-800 border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            NightLife
          </Link>
          
          <div className="flex items-center gap-4">
            {user ? (
              <div className="relative group">
                <button className="flex items-center gap-2 text-gray-300 hover:text-white">
                  <span className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                    {user.userDetail?.name?.[0] || user.userDetail?.email?.[0] || 'U'}
                  </span>
                </button>
                <div className="hidden group-hover:block absolute right-0 mt-2 w-48 bg-gray-700 rounded-lg shadow-lg py-2">
                  <button
                    onClick={handleLogout}
                    className="block px-4 py-2 text-gray-300 hover:bg-gray-600 w-full text-left"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex gap-4">
                <Link href="/login" className="text-gray-300 hover:text-white">
                  Login
                </Link>
                <Link href="/signup" className="text-gray-300 hover:text-white">
                  Signup
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}