// components/BookingForm.tsx
'use client';

interface BookingFormProps {
  bookingInfo: any;
  setBookingInfo: (info: any) => void;
  onBook: () => void;
}

export const BookingForm = ({ bookingInfo, setBookingInfo, onBook }: BookingFormProps) => (
  <>
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
  </>
);