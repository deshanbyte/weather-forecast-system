import { NextResponse } from 'next/server';

// This stores data in memory (it resets if Vercel restarts, but it's perfect for learning!)
let sensorData: any[] = [];

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const entry = {
      temp: body.temp,
      hum: body.hum,
      rain: body.rain,
      air: body.air,
      time: new Date()
    };

    sensorData.push(entry);
    if (sensorData.length > 50) sensorData.shift();

    return NextResponse.json({ message: 'Data stored successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to parse data' }, { status: 400 });
  }
}

export async function GET() {
  return NextResponse.json(sensorData);
}