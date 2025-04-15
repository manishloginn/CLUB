import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Cafe from '@/app/schema/cafe-schema'; // Assuming you have a Cafe schema
import Booking from '@/app/schema/booking-schema';
import BookingCollectRequest from '@/app/schema/booking-collect-requeststatus';

export async function GET(req: NextRequest) {

    await dbConnect();
    const { searchParams } = new URL(req.url);
    let location = searchParams.get('param');

    // const location = req.nextUrl.searchParams.get("param");

    console.log(location)
    try {
        console.log("🔄 Attempting to connect to MongoDB...");

        let query: any = {};

        if (location === 'approved') {
            query.isActive = true;
        } else if (location === 'pending') {
            query.isActive = false;
        }
        const cafes = await Cafe.aggregate([
            {
                $match: query
            },
           {
            $sort: { createdAt: -1 }
           }
        ]);




        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const totalCafes = await Cafe.countDocuments({ isActive: true });
        const pendingApprovals = await Cafe.countDocuments({ isActive: false })
        const todayBookings = await BookingCollectRequest.countDocuments({
            status: "SUCCESS",
            date: {
                $gte: startOfDay,
                $lt: endOfDay
            }
        })

        if (!cafes.length) {
            return NextResponse.json({ message: 'No cafes found' }, { status: 404 });
        }

        return NextResponse.json({ cafes, totalCafes, pendingApprovals, todayBookings }, { status: 200 });
    } catch (error) {
        console.error('Error fetching cafes:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
