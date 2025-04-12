import { NextRequest, NextResponse } from 'next/server';
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/dbConnect';
import User from '@/app/schema/user-schema';

export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        await dbConnect();

        const body = await req.json();
        const { email, password } = body;

      
        const user = await User.findOne({ email });

       

        if (!user) {
            return NextResponse.json({ error: "Invalid email or password" }, { status: 400 });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return NextResponse.json({ error: "Invalid email or password" }, { status: 400 });
        }

        const { password: userPassword, ...userWithoutPassword } = user.toObject();
        const token = jwt.sign({ userDetail: userWithoutPassword }, process.env.JWT_SECRET || 'your_jwt_secret', {
            expiresIn: '1h',
        });

        return NextResponse.json({ token:token, message : "Login Successfull" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 400 });
    }
}