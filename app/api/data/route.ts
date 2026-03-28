import { NextResponse } from 'next/server';

// This acts as a temporary "database" in your server's memory
let sensorData: any[] = [];

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // This creates a timestamped entry from the ESP32 data
    const entry = {
      temp: body.temp,
      hum: body.hum,
      rain: body.rain,
      air: body.air,
      time: new Date()
    };

    sensorData.push(entry);

    // Keep only the last 50 readings so the page stays fast
    if (sensorData.length > 50) {
      sensorData.shift();
    }

    console.log("New data received:", entry);
    return NextResponse.json({ message: 'Data stored successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to parse data' }, { status: 400 });
  }
}

export async function GET() {
  // This sends the stored data to your Dashboard UI
  return NextResponse.json(sensorData);
}