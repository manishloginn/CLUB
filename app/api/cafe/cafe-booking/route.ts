import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Booking from '@/app/schema/booking-schema';
import MenuItem from '@/app/schema/menu-schema'; // assuming this is your menu schema
import Razorpay from 'razorpay';
import { i } from 'framer-motion/client';
import BookingCollectRequest from '@/app/schema/booking-collect-requeststatus';


const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_SECRET!,
});
export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        console.log("🔄 Attempting to connect to MongoDB...");

        const body = await req.json();
        const {
            userId,
            cafeId,
            menuItemIds,
            date,
            timeSlot,
            numberOfPeople
        } = body;

        if (!userId || !cafeId || !menuItemIds || !date || !timeSlot || !numberOfPeople) {
            return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
        }

        if (numberOfPeople < 1 || numberOfPeople > 50) {
            return NextResponse.json({ message: 'You can book for 1 to 50 people only.' }, { status: 400 });
        }


        const menuItems = await MenuItem.find({ _id: { $in: menuItemIds } });

        if (!menuItems.length) {
            return NextResponse.json({ message: 'No valid menu items found' }, { status: 404 });
        }

        let totalPrice = 0;
        const comboNames: string[] = [];

        menuItems.forEach(item => {
            totalPrice += item.price * numberOfPeople;
            comboNames.push(item.combo);
        });


        const newBooking = new Booking({
            userId,
            cafeId,
            menuItems: comboNames,
            date,
            timeSlot,
            numberOfPeople,
            totalPrice,
            order_id: null,
            status: 'Pending'
        });
        await newBooking.save();

        const updateCollectRequest = await new BookingCollectRequest({
            collect_id: newBooking?._id,
            order_amount: newBooking?.totalPrice,
            transaction_amount: newBooking?.totalPrice,
            status: "PENDING",
            details: "",
            bank_reference: "",
            payment_time: "",
            reason: "",
            payment_message: "",
            payment_id: "",
        })
        updateCollectRequest.save()

        const razorOptions = {
            amount: totalPrice * 100,
            currency: 'INR',
            receipt: `receipt_${newBooking._id}`,
        };

        const order = await razorpay.orders.create(razorOptions);
        if (!order) {
            return NextResponse.json({ message: 'Failed to create payment order' }, { status: 500 });
        }
        if (order.status === 'created') {
            const updateBooking = await Booking.findByIdAndUpdate(newBooking._id,
                {
                    order_id: order.id || "",
                })
        }
        // 🔵 Razorpay order created: {
        //     amount: 219900,
        //     amount_due: 219900,
        //     amount_paid: 0,
        //     attempts: 0,
        //     created_at: 1744654745,
        //     currency: 'INR',
        //     entity: 'order',
        //     id: 'order_QJ2ANhtHNgUUfZ',
        //     notes: [],
        //     offer_id: null,
        //     receipt: 'receipt_67fd5197deff8943ce0e3f18',
        //     status: 'created'
        //   }


        return NextResponse.json({
            message: 'Booking successful and payment order created',
            booking: newBooking,
            razorpayOrder: {
                id: order.id,
                amount: order.amount,
                currency: order.currency,
            }
        }, { status: 201 });

    } catch (error) {
        console.error('Booking error:', error);
        return NextResponse.json({ message: (error as Error).message || 'Internal Server Error' }, { status: 500 });
    }
}
