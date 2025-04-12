import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Menu from '@/app/schema/menu-schema'; 
import Cafe from '@/app/schema/cafe-schema';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const { cafeId, combo, price } = body;
    if (!cafeId || !combo || typeof price !== 'number') {
      return NextResponse.json({ message: 'Missing or invalid fields' }, { status: 400 });
    }
    const existingCafe = await Cafe.findById( cafeId );
    if (!existingCafe) {
        return NextResponse.json({ message: 'Cafe not found' }, { status: 404 });
    }
    if (combo.length > 300) {
      return NextResponse.json({ message: 'Combo description too long' }, { status: 400 });
    }
    const newMenu = new Menu({
      cafeId,
      combo,
      price
    });
    await newMenu.save();
    return NextResponse.json({ newMenu, message: 'Menu added successfully' }, { status: 201 });

  } catch (error) {
    console.error('Menu API Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
