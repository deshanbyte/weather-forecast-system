'use client';
import { useEffect, useState } from 'react';

export default function Home() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/data');
        const json = await res.json();
        setData(Array.isArray(json) ? json : []);
      } catch (e) { console.log("Waiting for data..."); }
    };
    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);

  const latest = data.length > 0 ? data[data.length - 1] : { temp: 0, hum: 0, rain: 0, air: 0 };

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif', textAlign: 'center', backgroundColor: '#f0f4f8', minHeight: '100vh' }}>
      <h1 style={{ color: '#2c3e50' }}>🌦 IoT Weather Dashboard</h1>
      <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '30px', flexWrap: 'wrap' }}>
        <Card title="Temperature" value={`${latest.temp}°C`} color="#e67e22" />
        <Card title="Humidity" value={`${latest.hum}%`} color="#3498db" />
        <Card title="Rain" value={`${latest.rain}%`} color="#1abc9c" />
        <Card title="Air" value={`${latest.air}/100`} color="#95a5a6" />
      </div>
      <p style={{ marginTop: '30px', color: '#7f8c8d' }}>
        {data.length > 0 ? `✅ Connected: Showing ${data.length} records` : '📡 Waiting for ESP32 data...'}
      </p>
    </div>
  );
}

function Card({ title, value, color }: any) {
  return (
    <div style={{ background: 'white', padding: '20px', borderRadius: '15px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', width: '150px' }}>
      <h3 style={{ margin: '0', fontSize: '14px', color: '#7f8c8d' }}>{title}</h3>
      <p style={{ margin: '10px 0 0', fontSize: '24px', fontWeight: 'bold', color: color }}>{value}</p>
    </div>
  );
}
