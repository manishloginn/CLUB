import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Cafe from '@/app/schema/cafe-schema'; // Assuming you have a Cafe schema

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  let location = searchParams.get('location');

  console.log(location, "location");

  try {
    await dbConnect();
    console.log("🔄 Attempting to connect to MongoDB...");

    let query: any = {
    };

    
    if (location) {
      const locationWords = location.split(/\s+/); 
      query = {
        $or: locationWords.flatMap((word) => [
          { 'location.city': new RegExp(word, 'i') },
          { 'location.state': new RegExp(word, 'i') }
        ])
      };
    }

    console.log(query)
    // Fetch cafes with menu items based on the query (location filter)
    const cafes = await Cafe.aggregate([
      {
      $match: {
        ...query,
        isActive: true
      }
      },
      {
      $lookup: {
        from: "menus",
        localField: "_id",
        foreignField: "cafeId",
        as: "menuItems"
      }
      }
    ]);

    if (!cafes.length) {
      return NextResponse.json({ message: 'No cafes found' }, { status: 404 });
    }

    return NextResponse.json({ cafes }, { status: 200 });
  } catch (error) {
    console.error('Error fetching cafes:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
