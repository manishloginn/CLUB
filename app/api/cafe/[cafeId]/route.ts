import Cafe from '@/app/schema/cafe-schema';
import { Types } from 'mongoose';
import { NextResponse } from 'next/server';


// The handler function for the dynamic route
export async function GET(request: Request, { params }: { params: { cafeId: string } }) {
  const { cafeId } = params;
  console.log("Cafe ID:", cafeId); // Log the cafeId for debugging

  const convertObj = new Types.ObjectId(cafeId);
  // Find the cafe by cafeId
  const cafe = await Cafe.aggregate([
    {
        $match: { _id: convertObj } 
    },
    {
        $lookup:{
            from: "menus",
            localField: "_id",
            foreignField: "cafeId",
            as: "menuItems"
        }
    },
    {
      $project:{
        menuItems: 1,
      }
    }
]);

  console.log( cafe, "Fetched Cafe:"); // Log the fetched cafe for debugging

  if (!cafe) {
    return NextResponse.json({ message: 'Cafe not found' }, { status: 404 });
  }

  // Return the cafe data
  return NextResponse.json(cafe);
}
