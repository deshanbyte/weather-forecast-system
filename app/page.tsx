'use client';
import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Home() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/data');
        const json = await res.json();
        const displayData = json.length > 0 ? json : generateSeedData();
        setData(displayData);
      } catch (e) {
        console.error("Fetch error:", e);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const latest = data[data.length - 1] || { temp: 0, hum: 0, rain: 0, air: 0 };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-6 font-sans">
      <div className="max-w-6xl mx-auto mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black tracking-tighter italic uppercase">
            Enviro<span className="text-blue-500">Analytics</span>
          </h1>
          <div className="flex items-center gap-2 mt-2">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
            <p className="text-slate-400 text-xs uppercase font-bold tracking-widest">Station: Homagama (Live)</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-orange-500 to-red-600 p-8 rounded-[2rem] shadow-2xl">
            <p className="opacity-80 text-xs font-bold uppercase tracking-widest">Temperature</p>
            <h2 className="text-5xl font-black mt-2">{Number(latest.temp).toFixed(1)}°C</h2>
          </div>
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-8 rounded-[2rem] shadow-2xl">
            <p className="opacity-80 text-xs font-bold uppercase tracking-widest">Humidity</p>
            <h2 className="text-5xl font-black mt-2">{Number(latest.hum).toFixed(0)}%</h2>
          </div>
        </div>

        <div className="lg:col-span-2 bg-slate-800/30 border border-slate-700/50 backdrop-blur-xl p-8 rounded-[2.5rem]">
          <h3 className="text-xl font-bold mb-8 text-slate-200">Live Trend</h3>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.slice(-20)}>
                <defs>
                  <linearGradient id="colorMain" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="time" hide />
                <YAxis stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '15px' }} />
                <Area type="monotone" dataKey="temp" stroke="#3b82f6" fillOpacity={1} fill="url(#colorMain)" strokeWidth={4} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function generateSeedData() {
  return Array.from({ length: 20 }, (_, i) => ({
    temp: 24 + Math.random() * 6,
    hum: 50 + Math.random() * 20,
    air: 1 + Math.random() * 5,
    rain: Math.random() * 40,
    time: `${i}:00`
  }));
}
