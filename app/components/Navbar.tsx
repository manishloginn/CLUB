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
    <nav className="bg-gray-900/80 backdrop-blur-md border-b border-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo/Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 text-white" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent tracking-tight">
              Club Chale
            </span>
          </Link>
          
          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-gray-300 hover:text-white font-medium text-sm transition-colors">
              Home
            </Link>
            <Link href="/clubs" className="text-gray-300 hover:text-white font-medium text-sm transition-colors">
              Clubs
            </Link>
            <Link href="/events" className="text-gray-300 hover:text-white font-medium text-sm transition-colors">
              Events
            </Link>
            <Link href="/membership" className="text-gray-300 hover:text-white font-medium text-sm transition-colors">
              Membership
            </Link>
          </div>

          {/* User Section */}
          <div className="flex items-center gap-4">
            {user ? (
              <div className="relative group flex items-center gap-4">
                <Link href="/bookings" className="hidden sm:block text-sm font-medium px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors text-gray-200">
                  My Bookings
                </Link>
                
                <div className="relative">
                  <button className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-pink-400 flex items-center justify-center text-white font-medium shadow-md">
                      {user.userDetail?.name?.[0]?.toUpperCase() || user.userDetail?.email?.[0]?.toUpperCase() || 'U'}
                    </div>
                  </button>
                  
                  {/* Dropdown */}
                  <div className="hidden group-hover:block absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-xl border border-gray-700 overflow-hidden z-10">
                    <div className="px-4 py-3 border-b border-gray-700">
                      <p className="text-sm font-medium text-white truncate">
                        {user.userDetail?.name || user.userDetail?.email}
                      </p>
                      {user.userDetail?.email && (
                        <p className="text-xs text-gray-400 truncate">{user.userDetail.email}</p>
                      )}
                    </div>
                    <Link 
                      href="/profile" 
                      className="block px-4 py-3 text-sm text-gray-300 hover:bg-gray-700 transition-colors"
                    >
                      Profile Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-gray-700 transition-colors border-t border-gray-700"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex gap-3">
                <Link 
                  href="/login" 
                  className="px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white transition-colors"
                >
                  Login
                </Link>
                <Link 
                  href="/signup" 
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg transition-all"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}