import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';
import Cafe from '@/app/schema/cafe-schema';
import { getCoordinates } from '../../utils/getCoordinates';
import dbConnect from '@/lib/dbConnect';

export async function POST(req: NextRequest) {
    try {

        await dbConnect();

        const body = await req.json();
        const { club_name, location, images_url, capacity } = body;

        if (!club_name || !location || !images_url || !capacity) {
            return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
        }

        if (!location.address?.trim() || !location.city?.trim() || !location.country?.trim()) {
            return NextResponse.json({ message: 'Invalid location format' }, { status: 400 });
        }

        if (typeof capacity !== 'number' || capacity <= 0) {
            return NextResponse.json({ message: 'capacity must be a positive number' }, { status: 400 });
        }
        const existingCafe = await Cafe.findOne({ 
            club_name, 
            'location.address': location.address 
          });
      
        if (existingCafe) {
            return NextResponse.json({ message: 'Cafe with this name already exists and address' }, { status: 409 });
        }


        if (club_name.length > 100 || location.address.length > 200) {
            return NextResponse.json({ message: 'Input values exceed allowed length' }, { status: 400 });
        }

      //get cafe location in lat long format for geospatial queries
        const coordinates = await getCoordinates( location.city, location.state, location.country);

        if (!coordinates || coordinates.latitude == null || coordinates.longitude == null) {
            return NextResponse.json({ message: 'Invalid coordinates, unable to geocode address' }, { status: 400 });
        }


        const newCafe = new Cafe({
            club_name,
            location:{
                ...location,
                coordinates: coordinates ? [coordinates.latitude, coordinates.longitude] : [null, null]
            },
            images_url,
            capacity,
            isActive: false
        });

        await newCafe.save();

        return NextResponse.json({newCafe, message:"Registration Successfull"}, { status: 201 });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ message: (error as Error).message }, { status: 500 });
    }
}
