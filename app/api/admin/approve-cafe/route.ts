import Cafe from "@/app/schema/cafe-schema";
import dbConnect from "@/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";

export async function POST(req: NextRequest) {
    await dbConnect()
    const { cafeId, isActive } = await req.json();
    try {
        const updateCafe = await Cafe.findByIdAndUpdate(new Types.ObjectId(cafeId), {
            isActive:isActive
        })

        if(!updateCafe){
            throw new Error("Cafe Not Found")
        }
        return NextResponse.json({message:"Cafe is Active Successfully"}, {status:200})
    } catch (error) {
        console.error('Error fetching cafes:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}