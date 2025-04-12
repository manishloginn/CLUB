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
        handler: function (response: any) {
          alert("Payment successful! Payment ID: " + response.razorpay_payment_id);
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
  
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      alert("Booking Error: " + (error instanceof Error ? error.message : "Unknown error"));
    }
  };
  