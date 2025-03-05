import dbConnect from "@/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import User from "@/app/schema/user-schema";

export async function POST(req: NextRequest): Promise<NextResponse> {

  try {
    await dbConnect();

    const body = await req.json(); 
    const {name,  email, password, mobile_no, age  } = body;

    const allreadyExist = await User.findOne({
      email
    })

    if(allreadyExist){
      return NextResponse.json({ error: "User already exist" }, { status: 400 });
    }

    const saltRounds = Number(process.env.SALT) || 10; 
 
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({ 
      name,  
      email, 
      password:hashedPassword, 
      mobile_no, 
      age 
    });

    await newUser.save();

    console.log("Received Data:", { email, password });

    return NextResponse.json({ user:newUser, message:"Registration Successfull" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}


export async function GET(req: NextRequest): Promise<NextResponse> {
  await dbConnect();

  const users = await User.find();

  return NextResponse.json(users, { status: 200 });
}
