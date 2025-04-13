'use client';

import { useState, useEffect } from 'react';

// Utility to get today's date in 'YYYY-MM-DD' format
const getTodayDate = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

interface BookingFormProps {
  bookingInfo: {
    date: string;
    timeSlot: string;
    numberOfPeople: number;
  };
  setBookingInfo: (info: any) => void;
  onBook: () => void;
}

export const BookingForm = ({ bookingInfo, setBookingInfo, onBook }: BookingFormProps) => {
  const [error, setError] = useState<string | null>(null);
  const todayDate = getTodayDate();

  useEffect(() => {
    if (!bookingInfo.date) {
      setBookingInfo({ ...bookingInfo, date: todayDate });
    }
  }, []);

  const handleBooking = () => {
    if (!bookingInfo.date || !bookingInfo.timeSlot || bookingInfo.numberOfPeople < 1) {
      setError('⚠️ Please fill all fields before confirming your reservation.');
      return;
    }
    setError(null);
    onBook();
  };

  return (
    <>
      <h4 className="text-2xl font-bold text-white mb-4">📅 Reservation Details</h4>

      {error && <p className="text-red-400 mb-3 text-sm font-medium">{error}</p>}

      <div className="space-y-5 mb-6">
        {/* Date Input */}
        <div className="flex flex-col">
          <label className="text-sm text-gray-300 mb-1">Select Date</label>
          <input
            type="date"
            min={todayDate}
            value={bookingInfo.date}
            onChange={(e) => setBookingInfo({ ...bookingInfo, date: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
          />
        </div>

        {/* Time Slot Dropdown */}
        <div className="flex flex-col">
          <label className="text-sm text-gray-300 mb-1">Select Time Slot</label>
          <select
            value={bookingInfo.timeSlot}
            onChange={(e) => setBookingInfo({ ...bookingInfo, timeSlot: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
          >
            <option value="">-- Choose Time Slot --</option>
            <option>8:00 PM - 10:00 PM</option>
            <option>10:00 PM - 12:00 AM</option>
            <option>12:00 AM - 2:00 AM</option>
          </select>
        </div>

        {/* Number of People */}
        <div className="flex items-center justify-between bg-gray-800 px-4 py-3 rounded-xl border border-gray-700">
          <span className="text-gray-300">Number of Guests</span>
          <div className="flex items-center gap-3">
            <button
              onClick={() =>
                setBookingInfo({
                  ...bookingInfo,
                  numberOfPeople: Math.max(1, bookingInfo.numberOfPeople - 1),
                })
              }
              className="px-3 py-1 rounded-lg bg-gray-700 hover:bg-gray-600 text-white text-lg font-bold"
            >
              −
            </button>
            <span className="text-white w-8 text-center">{bookingInfo.numberOfPeople}</span>
            <button
              onClick={() =>
                setBookingInfo({
                  ...bookingInfo,
                  numberOfPeople: bookingInfo.numberOfPeople + 1,
                })
              }
              className="px-3 py-1 rounded-lg bg-gray-700 hover:bg-gray-600 text-white text-lg font-bold"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Confirm Button */}
      <button
        onClick={handleBooking}
        className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-2xl font-bold text-white text-lg transition-all transform hover:scale-105"
      >
        Confirm Reservation →
      </button>
    </>
  );
};
