import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';
import Cafe from '@/app/schema/cafe-schema';
import { getCoordinates } from '../../utils/getCoordinates';
import dbConnect from '@/lib/dbConnect';
import bcrypt from "bcrypt";

export async function POST(req: NextRequest) {
    try {
        await dbConnect();

        const body = await req.json();
        const { club_name, location, images_url, capacity, password, email_id } = body;

        // console.log(club_name, location, images_url, capacity, password, email_id)
        if (!club_name || !location || !images_url || !capacity || !password || !email_id) {
            return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
        }

        const { address, city, state, country } = location;

        if (!address?.trim() || !city?.trim() || !state?.trim() || !country?.trim()) {
            return NextResponse.json({ message: 'Invalid location format. Address, city, state, and country are required.' }, { status: 400 });
        }

        if (capacity <= 0) {
            return NextResponse.json({ message: 'Capacity must be a positive number' }, { status: 400 });
        }

        const findBymail = await Cafe.findOne({email_id})

        const existingCafe = await Cafe.findOne({
            club_name,
            'location.address': address
        });

        if (findBymail) {
            return NextResponse.json({ message: 'Cafe with this email id already exists' }, { status: 409 });
        }
        if (existingCafe) {
            return NextResponse.json({ message: 'Cafe with this name and address already exists' }, { status: 409 });
        }

        if (club_name.length > 100 || address.length > 200) {
            return NextResponse.json({ message: 'Input values exceed allowed length' }, { status: 400 });
        }

        let coordinates: [number | null, number | null] = [null, null];

        try {
            const geoData = await getCoordinates(city, state, country);
            if (
                geoData &&
                typeof geoData.latitude === 'number' &&
                typeof geoData.longitude === 'number'
            ) {
                coordinates = [geoData.longitude, geoData.latitude]; // GeoJSON format
            }
        } catch (geoErr) {
            console.warn("Geolocation failed:", geoErr);
        }
        const saltRounds = Number(process.env.SALT) || 10; 
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newCafe = new Cafe({
            club_name,
            location: {
                address,
                city,
                state,
                country,
                coordinates
            },
            images_url,
            capacity,
            isActive: false,
            email_id:email_id,
            password: hashedPassword,
        });
        await newCafe.save();
        return NextResponse.json({ newCafe, message: "Registration successful", success:true }, { status: 201 });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ message: (error as Error).message || 'Internal Server Error' }, { status: 500 });
    }
}

