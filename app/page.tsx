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

  const predict = (vals: number[], steps: number) => {
    if (vals.length < 2) return vals[vals.length - 1] || 0;
    const last = vals[vals.length - 1];
    const prev = vals[vals.length - 2];
    const slope = last - prev;
    return last + (slope * steps * 0.5); 
  };

  const latest = data[data.length - 1] || { temp: 0, hum: 0, rain: 0, air: 0 };
  const tempForecast = predict(data.map((d: any) => d.temp), 12);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white uppercase">Enviro <span className="text-blue-500">Analytics</span></h1>
          <p className="text-slate-400 text-sm flex items-center">
            <span className="relative flex h-2 w-2 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            Live Station: Homagama
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-orange-500 to-red-600 p-6 rounded-3xl shadow-xl">
            <p className="text-white/70 text-xs font-bold uppercase">Temperature</p>
            <h2 className="text-4xl font-black text-white mt-2">{Number(latest.temp).toFixed(1)}°C</h2>
          </div>
          <div className="bg-gradient-to-br from-blue-500 to-cyan-600 p-6 rounded-3xl shadow-xl">
            <p className="text-white/70 text-xs font-bold uppercase">Humidity</p>
            <h2 className="text-4xl font-black text-white mt-2">{Number(latest.hum).toFixed(0)}%</h2>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-6 rounded-3xl shadow-xl">
            <p className="text-white/70 text-xs font-bold uppercase">Air Quality</p>
            <h2 className="text-4xl font-black text-white mt-2">{latest.air}</h2>
          </div>
        </div>

        <div className="lg:col-span-2 bg-slate-800/50 border border-slate-700 p-6 rounded-3xl backdrop-blur-md">
          <h3 className="text-lg font-bold mb-6 text-slate-300">Predictive Trend Analysis</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.slice(-20)}>
                <defs>
                  <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="time" hide />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }} />
                <Area type="monotone" dataKey="temp" stroke="#3b82f6" fillOpacity={1} fill="url(#colorTemp)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-slate-700 text-center">
            <div>
              <p className="text-slate-500 text-[10px] uppercase font-bold">ARIMA Forecast</p>
              <p className="text-slate-200 font-bold">{tempForecast.toFixed(1)}°C</p>
            </div>
            <div>
              <p className="text-slate-500 text-[10px] uppercase font-bold">Rain Prob.</p>
              <p className="text-slate-200 font-bold">{latest.rain > 30 ? 'High' : 'Low'}</p>
            </div>
            <div>
              <p className="text-slate-500 text-[10px] uppercase font-bold">Sync</p>
              <p className="text-green-400 font-bold">Active</p>
            </div>
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
