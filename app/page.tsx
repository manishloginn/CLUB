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
      </div>
    </div>
  );
}