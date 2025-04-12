import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/dbConnect';
import Cafe from '@/app/schema/cafe-schema';
import bcrypt from "bcrypt";
import dotenv from 'dotenv';
dotenv.config();

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        const body = await req.json();
        const { club_name, password } = body;
        if (!club_name || !password) {
            return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
        }
        const cafe = await Cafe.findOne({ club_name });
        console.log(cafe, "cafe")
        if (!cafe) {
            return NextResponse.json({ message: 'club not found' }, { status: 401 });
        }
        const isPasswordValid = await bcrypt.compare(password, cafe.password);
        if (!isPasswordValid) {
            return NextResponse.json({ message: 'Invalid club name or password' }, { status: 401 });
        }
        const token = jwt.sign({ id: cafe._id }, process.env.JWT_SECRET || "secret key" , { expiresIn: '1h' });
        return NextResponse.json({ token, message: 'Login successful' }, { status: 200 });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ message: (error as Error).message }, { status: 500 });
    }
}