'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import Link from 'next/link';
import { SmartInsight } from '@/components/SmartInsight';

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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentRes = await fetch('/api/sensors/current');
        const currentData = await currentRes.json();
        
        const moisture = currentData.Soil_Moisture?.[id as string] || 0;
        
        // Generate mock history (replace with real data)
        const history = Array.from({ length: 15 }, (_, i) => ({
          time: `${15 - i} min ago`,
          moisture: moisture + (Math.random() * 10 - 5),
        })).reverse();
        
        setSensor({
          nodeId: id as string,
          moisture,
          temperature: currentData.Temperature,
          humidity: currentData.Humidity,
          history,
        });
      } catch (err) {
        console.error('Error:', err);
        setError('Failed to load sensor data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <div className="text-center py-8 text-white">Loading sensor data...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;
  if (!sensor) return <div className="text-center py-8">Sensor not found</div>;

  const getStatus = (value: number) => {
    if (value > 80) return { label: 'Wet', color: 'text-blue-600' };
    if (value > 40) return { label: 'Optimal', color: 'text-green-600' };
    return { label: 'Dry', color: 'text-orange-600' };
  };

  const status = getStatus(sensor.moisture);
  const change = '+2%';

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link href="/sensors" className="inline-flex items-center gap-2 text-green-600 hover:text-green-700">
        ← Back to Sensors
      </Link>

      {/* Header with Title and Status */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Sensor {sensor.nodeId.replace('_', ' ')}
        </h1>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          status.label === 'Wet' ? 'bg-blue-100 text-blue-600' :
          status.label === 'Optimal' ? 'bg-green-100 text-green-600' :
          'bg-orange-100 text-orange-600'
        }`}>
          {status.label}
        </span>
      </div>

      {/* Smart Insight */}
      <SmartInsight 
        temperature={sensor.temperature} 
        humidity={sensor.humidity}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          {/* Moisture Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-10 border-green-400 shadow-green-200 shadow-md mb-10 ">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">💧</span>
                <span className="text-gray-700 dark:text-gray-300 font-medium">Moisture</span>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {sensor.moisture}%
                </div>
              </div>
            </div>
          </div>

          {/* Temperature Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-10 border-green-400 shadow-green-200 shadow-md mb-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🌡️</span>
                <span className="text-gray-700 dark:text-gray-300 font-medium">Temperature</span>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {sensor.temperature}°C
                </div>
              </div>
            </div>
          </div>

          {/* Humidity Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-10 border-green-400 shadow-green-200 shadow-md mb-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">💨</span>
                <span className="text-gray-700 dark:text-gray-300 font-medium">Humidity</span>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {sensor.humidity}%
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Live Moisture Tracking (Takes 2/3 of space) */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-200 rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-default">
              Live Moisture Tracking
            </h2>
            <div className="text-right">
              <div className="text-3xl font-bold text-gray-900 dark:text-default">
                {sensor.moisture}%
              </div>
              <div className="text-sm text-green-600">{change}</div>
            </div>
          </div>
          <p className="text-sm text-default mb-4">Last 15 minutes</p>
          
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
    </div>
  );
}