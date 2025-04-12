// app/page.tsx
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
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [bookingInfo, setBookingInfo] = useState({
    date: "",
    timeSlot: "",
    numberOfPeople: 1,
  });
  const router = useRouter();

  useEffect(() => {
    fetch("/api/cafe")
      .then((res) => res.json())
      .then((data) => setCafes(data.cafes))
      .catch(() => alert("Failed to fetch cafes"));
  }, []);

  const onBook = async () => {
    if (!selectedCafe || selectedItems.length === 0) {
      alert("Please select menu items to book!");
      return;
    }

    interface DecodedToken {
      userDetail: {
        _id: string;
        email?: string;
        name?: string;
        mobile_no?: number;
      };
      iat?: number;
      exp?: number;
    }
    

    try {
      const userToken = localStorage.getItem("userToken");
      if (!userToken) {
        router.push('/login');
        return;
      }

      const decodedToken = jwtDecode<DecodedToken>(userToken);


      await handleBooking({
        userId: decodedToken?.userDetail?._id || '',
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
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent mb-4">
            🎉 Nightlife Reservations
          </h1>
          <p className="text-gray-300 text-lg">Book exclusive experiences at the hottest venues</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {cafes.map((cafe) => (
            <CafeCard
              key={cafe._id}
              cafe={cafe}
              onSelect={setSelectedCafe}
            />
          ))}
        </div>

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