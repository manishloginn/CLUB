import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`
    );
    const data = await response.json();

    if (data.error) {
      return NextResponse.json(
        { error: 'Reverse geocoding failed' },
        { status: 500 }
      );
    }

    const location = data.address;
    // Use empty string if city or state is missing
    const city = location.city || location.town || location.village || location.city_district || '';
    const state = location.state || location.region || '';

    return NextResponse.json({ city, state });
  } catch (error) {
    return NextResponse.json(
      { error: 'Reverse geocoding failed' },
      { status: 500 }
    );
  }
}
