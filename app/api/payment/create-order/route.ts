// File: app/api/payment/create-order/route.ts

import Razorpay from 'razorpay';
import { NextRequest, NextResponse } from 'next/server';

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_SECRET!,
});

export async function POST(req: NextRequest) {
    try {
        const rawBody = await req.text();
       
        const body = JSON.parse(rawBody);

        const { amount } = body;

        if (!amount || isNaN(amount) || amount <= 0) {
            return NextResponse.json({ message: 'Invalid amount' }, { status: 400 });
        }

        // Step 3: Create Razorpay order
        const options = {
            amount: amount * 100, 
            currency: 'INR',
            receipt: 'receipt_' + Date.now(),
        };

        console.log("🔵 Creating order with options:", options);

        console.log("🛠 Razorpay Key:", process.env.RAZORPAY_KEY_ID);
        console.log("🛠 Razorpay Secret:", process.env.RAZORPAY_SECRET);

        const order = await razorpay.orders.create(options);

        // Step 4: Send back response
        return NextResponse.json({
            success: true,
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
        });
    } catch (error: any) {
        console.error("🔴 Error creating order:", error);
        return NextResponse.json({
            message: 'Order creation failed',
            error: error.message || 'Unknown error',
        }, { status: 500 });
    }
}
