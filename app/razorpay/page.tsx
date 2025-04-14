'use client';

import { useState } from 'react';

export default function RazorpayPage() {
  const [loading, setLoading] = useState(false);

  const handleBookAndPay = async () => {
    setLoading(true);

    const payload = {
      userId: "67c446c2aca47fb7655da8fc",
      cafeId: "67fa3a26842431848c6eb400",
      menuItemIds: ["67fa420d842431848c6eb40d"],
      date: "2025-04-20",
      timeSlot: "7:00 PM - 9:00 PM",
      numberOfPeople: 6,
    };

    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Something went wrong!");
        return;
      }

      const { razorpayOrder, booking } = data;

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, 
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "Cafe Booking",
        description: "Cafe reservation payment",
        order_id: razorpayOrder.id,
        handler: function (response: any) {
          alert("Payment successful! 🎉");
          console.log('check working or not')
          console.log("Payment Details:", response);
        },
        prefill: {
          name: "Manish",
          email: "manish@example.com",
          contact: "9876543210",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const razor = new (window as any).Razorpay(options);
      razor.open();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Book & Pay</h2>
      <button
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        onClick={handleBookAndPay}
        disabled={loading}
      >
        {loading ? "Processing..." : "Book and Pay"}
      </button>
    </div>
  );
}
