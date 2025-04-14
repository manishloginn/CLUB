import dbConnect from "@/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import User from "@/app/schema/user-schema";
import Booking from "@/app/schema/booking-schema";
import BookingCollectRequest from "@/app/schema/booking-collect-requeststatus";




export async function POST(req: NextRequest): Promise<NextResponse> {
    await dbConnect();
    const body = await req.json();
     const details = JSON.stringify(body);
    const { payload, event } = body;
    let { order_id, amount, method, status, bank, acquirer_data, error_reason, id } = payload.payment.entity;
    let { created_at } = payload.payment;

    
    try {
        const updateBooking = await Booking.findOneAndUpdate({ order_id}, { status: "SUCCESS" }, { new: true });
        const updateCollectRequest = await new BookingCollectRequest({
            collect_id: updateBooking?._id,
            order_amount: updateBooking?.totalPrice,
            transaction_amount: updateBooking?.totalPrice,
            status: "SUCCESS",
            details: details,
            bank_reference: acquirer_data.bank_transaction_id || acquirer_data.rrn,
            payment_time: Date.now().toString(),
            reason: '',
            payment_message: event,
            payment_id: id,
        })

        return NextResponse.json({ message: "Registration Successfull" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 400 });
    }
}
