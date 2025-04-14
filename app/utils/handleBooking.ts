import BookingCollectRequest from "../schema/booking-collect-requeststatus";
import Booking from "../schema/booking-schema";


export const handleBooking = async ({
  userId,
  cafeId,
  menuItemIds,
  date,
  timeSlot,
  numberOfPeople,
}: {
  userId: string;
  cafeId: string;
  menuItemIds: string[];
  date: string;
  timeSlot: string;
  numberOfPeople: number;
}) => {
  try {
    const res = await fetch("/api/cafe/cafe-booking", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        cafeId,
        menuItemIds,
        date,
        timeSlot,
        numberOfPeople,
      }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message);

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: data.razorpayOrder.amount,
      currency: data.razorpayOrder.currency,
      name: "Cafe Booking",
      description: "Booking Payment",
      order_id: data.razorpayOrder.id,
      handler: async function (response: any) {
        console.log("Payment Details:", response);
       
        // handelUpdateBooking(response)
        //           razorpay_order_id:"order_QJ2V1ae3CmrFNJ"
        // razorpay_payment_id:"pay_QJ2VBlnh6TNmh4"
        // razorpay_signature:"df16fba8b4ea22aaf089e856fd6011ea5ca084a154fce71e6418106227c4526e"

        // alert("Payment successful! Payment ID: " + response.razorpay_payment_id);
      },
      prefill: {
        name: "Manish",
        email: "manish@example.com",
        contact: "9999999999",
      },
      notes: {
        bookingId: data.booking._id,
      },
      theme: {
        color: "#F37254",
      },
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  } catch (error) {
    alert("Booking Error: " + (error instanceof Error ? error.message : "Unknown error"));
  }
};
