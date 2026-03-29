'use client';
import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface SensorData {
  temp: number;
  hum: number;
  rain: number;
  air: number;
  time?: string;
}

export default function Home() {
  const [data, setData] = useState<SensorData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/data');
        const json = await res.json();
        const displayData = json.length > 0 ? json : generateSeedData();
        setData(displayData);
        setLoading(false);
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
  const tempForecast = predict(data.map(d => d.temp), 12);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white">ENVIRO <span className="text-blue-500">PRO</span></h1>
          <p className="text-slate-400 text-sm flex items-center">
            <span className="relative flex h-2 w-2 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            Live Feed: Homagama, SL
          </p>
        </div>
        <div className="text-right hidden md:block">
          <p className="text-xs text-slate-500 uppercase font-bold">System Status</p>
          <p className="text-green-400 font-mono">NOMINAL</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-6">
          <StatCard title="Temperature" value={`${latest.temp.toFixed(1)}°C`} color="from-orange-500 to-red-600" />
          <StatCard title="Humidity" value={`${latest.hum.toFixed(0)}%`} color="from-blue-500 to-cyan-600" />
          <StatCard title="Air Quality" value={latest.air} color="from-purple-500 to-indigo-600" />
        </div>

        <div className="lg:col-span-2 bg-slate-800/50 border border-slate-700 p-6 rounded-3xl backdrop-blur-md">
          <h3 className="text-lg font-bold mb-6 text-slate-300">Environmental Trend Analysis</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.slice(-20)}>
                <defs>
                  <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke
