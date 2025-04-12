import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Cafe from '@/app/schema/cafe-schema'; // Assuming you have a Cafe schema

export async function GET(req: NextRequest ) {

  try {
    await dbConnect();
    console.log("🔄 Attempting to connect to MongoDB...");
    // Fetch all cafe details from the database
    const cafes = await Cafe.aggregate([
        {
            $lookup:{
                from: "menus",
                localField: "_id",
                foreignField: "cafeId",
                as: "menuItems"
            }
        }
    ]);
    // console.log(cafes, "cafes")

    if (!cafes.length) {
      return NextResponse.json({ message: 'No cafes found' }, { status: 404 });
    }

    return NextResponse.json({ cafes }, { status: 200 });
  } catch (error) {
    console.error('Error fetching cafes:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
