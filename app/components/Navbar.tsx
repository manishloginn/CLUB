'use client';

import Link from 'next/link';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const userToken = typeof window !== 'undefined' ? localStorage.getItem('userToken') : null;
  const user = userToken ? jwtDecode<DecodedToken>(userToken) : null;

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    setIsDrawerOpen(false);
    router.push('/login');
  };

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <>
      <nav className="bg-gray-900/80 backdrop-blur-md border-b border-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-white"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent tracking-tight">
                Club Chale
              </span>
            </Link>

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

            <div className="flex items-center gap-4">
              {user ? (
                <button
                  onClick={toggleDrawer}
                  className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-pink-400 flex items-center justify-center text-white font-medium shadow-md"
                >
                  {user.userDetail?.name?.[0]?.toUpperCase() ||
                    user.userDetail?.email?.[0]?.toUpperCase() ||
                    'U'}
                </button>
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

      {/* Side Drawer */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={() => setIsDrawerOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
            />
            <motion.div
              className="fixed top-0 right-0 w-64 h-full bg-gray-900 shadow-xl z-50 flex flex-col p-6 gap-4 border-l border-gray-700"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-white font-bold text-lg">
                    {user?.userDetail?.name || 'User'}
                  </p>
                  {user?.userDetail?.email && (
                    <p className="text-gray-400 text-sm truncate">{user.userDetail.email}</p>
                  )}
                </div>
                <button onClick={() => setIsDrawerOpen(false)} className="text-gray-400 hover:text-white text-xl">
                  ✕
                </button>
              </div>

              <Link
                href="/bookings"
                className="text-gray-300 hover:bg-gray-800 px-4 py-2 rounded-md transition"
                onClick={() => setIsDrawerOpen(false)}
              >
                My Bookings
              </Link>
              <Link
                href="/profile"
                className="text-gray-300 hover:bg-gray-800 px-4 py-2 rounded-md transition"
                onClick={() => setIsDrawerOpen(false)}
              >
                Profile Settings
              </Link>
              <button
                onClick={handleLogout}
                className="text-left text-red-400 hover:bg-gray-800 px-4 py-2 rounded-md transition mt-auto"
              >
                Logout
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
