'use client';
import { useEffect, useState } from 'react';

export default function Home() {
  const [data, setData] = useState<any[]>([]);

  const refreshData = async () => {
    try {
      const response = await fetch('/api/data');
      const result = await response.json();
      if (Array.isArray(result)) {
        setData(result);
      }
    } catch (err) {
      console.log("Waiting for connection...");
    }
  };

  useEffect(() => {
    refreshData();
    const timer = setInterval(refreshData, 3000);
    return () => clearInterval(timer);
  }, []);

  const latest = data.length > 0 ? data[data.length - 1] : { temp: 0, hum: 0, rain: 0, air: 0 };

  return (
    <div style={{ padding: '40px', fontFamily: 'Arial, sans-serif', textAlign: 'center', backgroundColor: '#f4f7f6', minHeight: '100vh' }}>
      <h1 style={{ color: '#333', marginBottom: '30px' }}>🌦 IoT Weather Station</h1>
      
      <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <Box title="Temp" value={`${latest.temp}°C`} color="#FF5733" />
        <Box title="Humidity" value={`${latest.hum}%`} color="#33A2FF" />
        <Box title="Rain" value={`${latest.rain}%`} color="#2ECC71" />
        <Box title="Air Quality" value={`${latest.air}`} color="#9B59B6" />
      </div>

      <div style={{ marginTop: '40px', color: '#666' }}>
        <p>{data.length > 0 ? `🟢 Active: Receiving updates` : '📡 System Ready: Waiting for ESP32...'}</p>
      </div>
    </div>
  );
}

function Box({ title, value, color }: any) {
  return (
    <div style={{ background: 'white', padding: '25px', borderRadius: '15px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', width: '160px' }}>
      <p style={{ margin: '0', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', color: '#888' }}>{title}</p>
      <p style={{ margin: '10px 0 0', fontSize: '28px', fontWeight: 'bold', color: color }}>{value}</p>
    </div>
  );
}
