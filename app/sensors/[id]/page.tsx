'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import Link from 'next/link';

interface SensorDetail {
  nodeId: string;
  moisture: number;
  temperature: number;
  humidity: number;
  history: Array<{ time: string; moisture: number }>;
}

export default function SensorDetailPage() {
  const { id } = useParams();
  const [sensor, setSensor] = useState<SensorDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSensor = async () => {
      try {
        const res = await fetch(`/api/sensors/current`);
        const data = await res.json();
        const moisture = data.Soil_Moisture?.[id as string] || 0;
        
        // Generate mock history (replace with real data)
        const history = Array.from({ length: 15 }, (_, i) => ({
          time: `${15 - i} min ago`,
          moisture: moisture + (Math.random() * 10 - 5),
        })).reverse();

        setSensor({
          nodeId: id as string,
          moisture,
          temperature: data.Temperature,
          humidity: data.Humidity,
          history,
        });
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSensor();
  }, [id]);

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (!sensor) return <div className="text-center py-8">Sensor not found</div>;

  const getCondition = (value: number) => {
    if (value > 80) return { label: 'Wet', color: 'text-blue-600' };
    if (value > 40) return { label: 'Optimal', color: 'text-green-600' };
    if (value > 10) return { label: 'Dry', color: 'text-orange-600' };
    return { label: 'Critical', color: 'text-red-600' };
  };

  const condition = getCondition(sensor.moisture);

  return (
    <div>
      <Link href="/" className="text-green-600 mb-4 inline-block">
      ← Back to Dashboard
      </Link>
      <p className="text-gray-600 mb-6">Living Room</p>

      {/* Current State Card */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Current State</h2>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-3xl font-bold text-gray-900">{sensor.moisture}%</div>
            <div className="text-sm text-gray-500">Soil Moisture</div>
            <div className={`text-sm font-medium mt-1 ${condition.color}`}>
              {condition.label}
            </div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-3xl font-bold text-gray-900">{sensor.temperature}°C</div>
            <div className="text-sm text-gray-500">Temperature</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-3xl font-bold text-gray-900">{sensor.humidity}%</div>
            <div className="text-sm text-gray-500">Humidity</div>
          </div>
        </div>
      </div>

      {/* Live Moisture Tracking Graph */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4">Live Moisture Tracking</h2>
        <p className="text-sm text-gray-500 mb-4">Last 15 minutes</p>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={sensor.history}>
            <XAxis dataKey="time" stroke="#888" fontSize={12} />
            <YAxis domain={[0, 100]} stroke="#888" fontSize={12} />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="moisture" 
              stroke="#4CAF50" 
              strokeWidth={2}
              dot={{ fill: '#4CAF50', r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}