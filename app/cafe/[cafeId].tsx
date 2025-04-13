import React, { useEffect, useState } from "react";
import { useRouter } from "next/router"; // Use Next.js useRouter for accessing URL params
import { handleBooking } from "@/app/utils/handleBooking"; // Import your handleBooking function

export default function CafeMenuPage() {
  const router = useRouter();
  const { cafeId } = router.query; // Get cafeId from URL

  const [selectedCafe, setSelectedCafe] = useState<any | null>(null);
  const [menu, setMenu] = useState<any[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [bookingInfo, setBookingInfo] = useState({
    date: "",
    timeSlot: "",
    numberOfPeople: 1,
  });

  useEffect(() => {
    if (cafeId) {
      // Fetch the specific cafe's details using cafeId from URL
      fetch(`/api/cafe/${cafeId}`)
        .then((res) => res.json())
        .then((data) => {
          setSelectedCafe(data.cafe);
          setMenu(data.cafe.menuItems || []);
        })
        .catch((err) => alert("Failed to fetch cafe details"));
    }
  }, [cafeId]);

  const onBook = () => {
    console.log("Booking with:", selectedItems);
    handleBooking({
      userId: "67c446c2aca47fb7655da8fc",
      cafeId: selectedCafe?._id,
      menuItemIds: selectedItems,
      date: bookingInfo.date,
      timeSlot: bookingInfo.timeSlot,
      numberOfPeople: bookingInfo.numberOfPeople,
    });
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">
        {selectedCafe?.club_name} - Menu
      </h1>

      {/* Menu Items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
        {menu?.map((item) => (
          <div key={item._id} className="p-4 bg-white border rounded shadow-md">
            <h3 className="text-xl font-bold">{item.combo}</h3>
            <p>₹{item.price}</p>
            <input
              type="checkbox"
              value={item._id}
              onChange={(e) => {
                const { checked, value } = e.target;
                if (checked) {
                  setSelectedItems((prev) => [...prev, value]);
                } else {
                  setSelectedItems((prev) => prev.filter((id) => id !== value));
                }
              }}
            /> Add to Order
          </div>
        ))}
      </div>

      {/* Booking Info */}
      <div className="bg-white p-6 rounded-xl shadow-md mt-4 w-full">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Booking Info</h2>
        <input
          type="date"
          value={bookingInfo.date}
          onChange={(e) => setBookingInfo({ ...bookingInfo, date: e.target.value })}
          className="mb-4 w-full border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Time Slot (e.g. 7:00 PM - 9:00 PM)"
          value={bookingInfo.timeSlot}
          onChange={(e) => setBookingInfo({ ...bookingInfo, timeSlot: e.target.value })}
          className="mb-4 w-full border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Number of People"
          value={bookingInfo.numberOfPeople}
          onChange={(e) => setBookingInfo({ ...bookingInfo, numberOfPeople: parseInt(e.target.value) })}
          className="mb-6 w-full border p-2 rounded"
        />

        <button
          onClick={onBook}
          className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 w-full"
        >
          Book & Pay
        </button>
      </div>
    </div>
  );
}
