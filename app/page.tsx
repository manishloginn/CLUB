'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { handleBooking } from '@/app/utils/handleBooking';
import { CafeCard } from '@/app/components/CafeCard';
import { BookingModal } from '@/app/components/BookingModal';
import { Cafe } from '@/app/types';
import Navbar from '@/app/components/Navbar';
import { MenuItem } from './types';
import { jwtDecode } from 'jwt-decode';
import Link from 'next/link';

export default function HomePage() {
  const [cafes, setCafes] = useState<Cafe[]>([]);
  const [selectedCafe, setSelectedCafe] = useState<Cafe | null>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [bookingInfo, setBookingInfo] = useState({
    date: "",
    timeSlot: "",
    numberOfPeople: 1,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const fetchCafes = async () => {
    try {
      setLoading(true);
      const url = `/api/cafe${searchQuery ? `?location=${encodeURIComponent(searchQuery)}` : ''}`;
      const res = await fetch(url);
      const data = await res.json();
      setCafes(data.cafes ?? []);
    } catch (error) {
      alert("Failed to fetch cafes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchCafes();
    }, 500);

    return () => clearTimeout(timeout);
  }, [searchQuery]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await fetch(
              `/api/reverse-geocode?lat=${latitude}&lon=${longitude}`
            );
            const { city, state } = await response.json();
            setSearchQuery(`${city} ${state}`);
          } catch (error) {
            console.error("Location detection failed:", error);
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
        }
      );
    }
  }, []);

  const onBook = async () => {
    if (!selectedCafe || selectedItems.length === 0) {
      alert("Please select menu items to book!");
      return;
    }

    try {
      const userToken = localStorage.getItem("userToken");
      if (!userToken) {
        router.push('/login');
        return;
      }

      const decodedToken = jwtDecode<{ userDetail: { _id: string } }>(userToken);

      await handleBooking({
        userId: decodedToken.userDetail._id,
        cafeId: selectedCafe._id,
        menuItemIds: selectedItems,
        date: bookingInfo.date,
        timeSlot: bookingInfo.timeSlot,
        numberOfPeople: bookingInfo.numberOfPeople,
      });
      setSelectedCafe(null);
    } catch (err) {
      console.error("Booking failed:", err);
      alert("Booking failed!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black">
      <Navbar />

      <div className="p-8 max-w-7xl mx-auto">
        <header className="text-center mb-16">
          {/* Premium Club Chale Logo */}
          <div className="flex flex-col items-center justify-center mb-6">
            <div className="relative">
              {/* Logo Symbol */}
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30 mb-4 mx-auto">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 text-white"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
              </div>

              {/* Logo Text */}
              {/* <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-500 bg-clip-text text-transparent mb-2">
                Club Chale
              </h1> */}
              <p className="text-gray-300 text-lg tracking-wider">
                PREMIUM NIGHTLIFE EXPERIENCES
              </p>
            </div>
          </div>

          {/* Search Box */}
          <div className="max-w-2xl mx-auto relative">
            <input
              type="text"
              placeholder="Search clubs by city or state..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-4 rounded-xl bg-gray-800 text-white placeholder-gray-400 
                focus:outline-none focus:ring-2 focus:ring-purple-500 border border-gray-700 transition-all"
            />
            <div className="absolute right-4 top-4 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </header>

        {/* Loading Spinner */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-pulse bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent text-xl">
              🔍 Finding premium clubs near you...
            </div>
            <div className="mt-4 flex justify-center">
              <div className="h-2 w-24 bg-purple-500 rounded-full animate-bounce delay-100"></div>
              <div className="h-2 w-24 bg-pink-500 rounded-full animate-bounce delay-200 mx-4"></div>
              <div className="h-2 w-24 bg-purple-500 rounded-full animate-bounce delay-300"></div>
            </div>
          </div>
        ) : (
          <>
            {/* Cafe Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {cafes?.map((cafe) => (
                <CafeCard
                  key={cafe._id}
                  cafe={cafe}
                  onSelect={setSelectedCafe}
                />
              ))}
            </div>

            {/* No Cafes Found */}
            {!loading && cafes?.length === 0 && (
              <div className="text-center py-16">
                <div className="inline-block p-6 bg-gray-800/50 rounded-xl">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-pink-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-xl font-medium text-gray-200 mb-1">No premium clubs found</h3>
                  <p className="text-gray-400">Try searching another location</p>
                </div>
              </div>
            )}
          </>
        )}

        {/* Booking Modal */}
        {selectedCafe && (
          <BookingModal
            cafe={selectedCafe}
            onClose={() => setSelectedCafe(null)}
            onBook={onBook}
            selectedItems={selectedItems}
            setSelectedItems={setSelectedItems}
            bookingInfo={bookingInfo}
            setBookingInfo={setBookingInfo}
          />
        )}
        {/* Footer Section */}
        <footer className="bg-gray-900/50 border-t border-gray-800 mt-16 py-12">
          <div className="max-w-7xl mx-auto px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Contact Info */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                  Contact Us
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span className="text-gray-300">+91 7053468609</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <a href="mailto:manishv7053@gmail.com" className="text-gray-300 hover:text-purple-300 transition-colors">
                      manishv7053@gmail.com
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-gray-300">Delhi, India</span>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                  Quick Links
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <Link href="/about" className="text-gray-300 hover:text-purple-300 transition-colors">
                    About Us
                  </Link>
                  <Link href="/clubs" className="text-gray-300 hover:text-purple-300 transition-colors">
                    Our Clubs
                  </Link>
                  <Link href="/events" className="text-gray-300 hover:text-purple-300 transition-colors">
                    Events
                  </Link>
                  <Link href="/membership" className="text-gray-300 hover:text-purple-300 transition-colors">
                    Membership
                  </Link>
                  <Link href="/privacy" className="text-gray-300 hover:text-purple-300 transition-colors">
                    Privacy Policy
                  </Link>
                  <Link href="/terms" className="text-gray-300 hover:text-purple-300 transition-colors">
                    Terms
                  </Link>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                  Follow Us
                </h3>
                <div className="flex gap-4">
                  <a href="#" className="text-gray-300 hover:text-purple-300 transition-colors">
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                    </svg>
                  </a>
                  <a href="#" className="text-gray-300 hover:text-purple-300 transition-colors">
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </a>
                  <a href="#" className="text-gray-300 hover:text-purple-300 transition-colors">
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Copyright */}
            <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400 text-sm">
              <p>© {new Date().getFullYear()} Club Chale. All rights reserved.</p>
            </div>
          </div>
        </footer>

      </div>
    </div >

  );
}