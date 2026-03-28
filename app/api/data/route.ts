import { NextResponse } from 'next/server';

// This stores data in the server's memory while it's running
let sensorData: any[] = [];

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    const entry = {
      temp: body.temp || 0,
      hum: body.hum || 0,
      rain: body.rain || 0,
      air: body.air || 0,
      time: new Date().toISOString()
    };

    sensorData.push(entry);

    // Keep the list from getting too long (last 50 readings)
    if (sensorData.length > 50) {
      sensorData.shift();
    }

    return NextResponse.json({ message: "Data received!" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Invalid Data" }, { status: 400 });
  }
}

export async function GET() {
  // This is what the dashboard calls to see the weather
  return NextResponse.json(sensorData);
}
