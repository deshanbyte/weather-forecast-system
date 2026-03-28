import { NextResponse } from 'next/server';
let sensorData: any[] = [];

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const entry = { ...body, time: new Date() };
    sensorData.push(entry);
    if (sensorData.length > 50) sensorData.shift();
    return NextResponse.json({ message: 'Data stored' });
  } catch (e) {
    return NextResponse.json({ error: 'Fail' }, { status: 400 });
  }
}

export async function GET() {
  return NextResponse.json(sensorData);
}
