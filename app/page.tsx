'use client';
import React, { useEffect, useState } from 'react';
// Import only what you actually use to prevent build errors
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Add this "Interface" so TypeScript stops complaining
interface SensorData {
  temp: number;
  hum: number;
  rain: number;
  air: number;
  time?: string;
}
