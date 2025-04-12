'use client';
import React, { useEffect, useState } from "react";
import { handleBooking } from "@/app/utils/handleBooking";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { capitalize } from "./utils/capitalize";
import {jwtDecode} from 'jwt-decode';
import { useRouter } from "next/navigation";



interface Cafe {
  _id: string;
  club_name: string;
  location: { address: string, state: string, city: string, country: string };
  images_url: string[];
  menuItems?: MenuItem[];
}

interface MenuItem {
  _id: string;
  combo: string;
  price: number;
  description?: string;
}

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

  const onCafeClick = (cafe: Cafe) => {
    setSelectedCafe(cafe);
    setMenu(cafe.menuItems || []);
    setSelectedItems([]);
    setBookingInfo({
      date: "",
      timeSlot: "",
      numberOfPeople: 1,
    });
  };



  const onBook = async () => {
    if (!selectedCafe || selectedItems.length === 0) {
      alert("Please select menu items to book!");
      return;
    }
  
    const userTokencookie = localStorage.getItem("userToken");
  
    if (!userTokencookie) {
      throw new Error("User token is missing");
    }
  
    try {
      // 👇 Define a type for your decoded token
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
      
  
      const decodedToken = jwtDecode<DecodedToken>(userTokencookie);
      console.log("Decoded Token:", decodedToken?.userDetail);
  
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
      console.error("Invalid token:", err);
      alert("Invalid token!");
    }
  };
  
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-8">
      <header className="text-center mb-16">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent mb-4 font-space">
          🎉 Nightlife Reservations
        </h1>
        <p className="text-gray-300 text-lg">Book exclusive experiences at the hottest venues</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        {cafes.map((cafe) => (
          <div
            key={cafe._id}
            className="relative bg-gray-800 rounded-2xl overflow-hidden shadow-2xl hover:scale-105 transition-all cursor-pointer"
          >
            <Carousel
              infiniteLoop
              autoPlay
              showThumbs={false}
              showStatus={false}
              showIndicators={false}
            >
              {cafe.images_url.map((url, index) => (
                <div key={index} className="relative h-64">
                  <img
                    src={url}
                    alt={cafe.club_name}
                    className="w-full h-full object-cover opacity-90"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black p-4"
                    onClick={() => onCafeClick(cafe)}
                  >
                    <h3 className="text-2xl font-bold text-white">{capitalize(cafe.club_name)}</h3>
                    <p className="text-purple-300 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      {`${capitalize(cafe.location?.address)}, ${capitalize(cafe.location?.city)}, ${capitalize(cafe.location?.state)}, ${capitalize(cafe.location?.country)}`}
                    </p>
                  </div>
                </div>
              ))}
            </Carousel>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedCafe && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center">
          <div className="bg-gray-900 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-lg relative">
            <button
              onClick={() => setSelectedCafe(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl"
            >
              &times;
            </button>

            <h2 className="text-3xl text-white font-bold mb-6">{selectedCafe.club_name}</h2>

            <h4 className="text-xl font-semibold text-white mb-4">🍸 Signature Cocktails</h4>
            <div className="grid gap-3 mb-6">
              {menu.map((item) => (
                <label
                  key={item._id}
                  className="flex items-center p-3 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
                >
                  <input
                    type="checkbox"
                    value={item._id}
                    checked={selectedItems.includes(item._id)}
                    onChange={(e) => {
                      const { checked, value } = e.target;
                      setSelectedItems(prev =>
                        checked ? [...prev, value] : prev.filter(id => id !== value)
                      );
                    }}
                    className="form-checkbox h-5 w-5 text-purple-400 rounded-sm border-gray-400"
                  />
                  <div className="ml-3 flex-1">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-100">{item.combo}</span>
                      <span className="text-purple-300 font-medium">₹{item.price}</span>
                    </div>
                    <p className="text-sm text-gray-400 mt-1">
                      {item.description || "Premium cocktail experience"}
                    </p>
                  </div>
                </label>
              ))}
            </div>

            <h4 className="text-xl font-semibold text-white mb-4">📅 Reservation Details</h4>
            <div className="space-y-4 mb-6">
              <input
                type="date"
                value={bookingInfo.date}
                onChange={(e) => setBookingInfo({ ...bookingInfo, date: e.target.value })}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
              />
              <select
                value={bookingInfo.timeSlot}
                onChange={(e) => setBookingInfo({ ...bookingInfo, timeSlot: e.target.value })}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
              >
                <option value="">Select Time Slot</option>
                <option>8:00 PM - 10:00 PM</option>
                <option>10:00 PM - 12:00 AM</option>
                <option>12:00 AM - 2:00 AM</option>
              </select>

              <div className="flex items-center bg-gray-700 p-3 rounded-lg">
                <span className="text-gray-300 flex-1">Number of Guests</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setBookingInfo({
                      ...bookingInfo,
                      numberOfPeople: Math.max(1, bookingInfo.numberOfPeople - 1)
                    })}
                    className="px-3 py-1 rounded bg-gray-600 hover:bg-gray-500 text-white"
                  >
                    -
                  </button>
                  <span className="text-white w-8 text-center">{bookingInfo.numberOfPeople}</span>
                  <button
                    onClick={() => setBookingInfo({
                      ...bookingInfo,
                      numberOfPeople: bookingInfo.numberOfPeople + 1
                    })}
                    className="px-3 py-1 rounded bg-gray-600 hover:bg-gray-500 text-white"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={onBook}
              className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-xl font-bold text-white transition-all transform hover:scale-[1.02]"
            >
              Confirm Reservation →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
