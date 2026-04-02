'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import Link from 'next/link';

interface HistoryRecord {
  id: string;
  timestamp: string;
  humidity: number;
  temperature: number;
  soilMoisture: Record<string, number>;
}

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
        // Fetch current data
        const currentRes = await fetch('/api/sensors/current');
        const currentData = await currentRes.json();
        
        // Fetch history data
        const historyRes = await fetch('/api/sensors/history');
        const historyData = await historyRes.json();
        
        const moisture = currentData.Soil_Moisture?.[id as string] || 0;
        
        // Process history for this specific sensor
        const history = (Array.isArray(historyData) ? historyData : [])
          .filter((record: HistoryRecord) => record.soilMoisture?.[id as string] !== undefined)
          .slice(-15) // Get last 15 records
          .map((record: HistoryRecord) => ({
            time: new Date(record.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            moisture: record.soilMoisture[id as string],
          }));
        
        setSensor({
          nodeId: id as string,
          moisture,
          temperature: currentData.Temperature,
          humidity: currentData.Humidity,
          history: history.length > 0 ? history : [
            // Fallback mock data if no history exists
            { time: 'No data', moisture: moisture }
          ],
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

  if (loading) return <div className="text-center py-8">Loading sensor data...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;
  if (!sensor) return <div className="text-center py-8">Sensor not found</div>;

  const getCondition = (value: number) => {
    if (value > 80) return { label: 'Wet', color: 'text-blue-600' };
    if (value > 40) return { label: 'Optimal', color: 'text-green-600' };
    return { label: 'Dry', color: 'text-orange-600' };
  };

  const condition = getCondition(sensor.moisture);

  return (
    <div>
      <Link href="/" className="text-green-600 mb-4 inline-block">
        ← Back to Dashboard
      </Link>
      
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        Sensor {sensor.nodeId.replace('_', ' ')}
      </h1>
      

      {/* Current State Card */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-green-400 shadow-green-200 mb-6">
        <h2 className="text-lg font-semibold mb-4">Current State</h2>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 bg-gray-200 rounded-lg">
            <div className="text-3xl font-bold text-gray-900">{sensor.moisture}%</div>
            <div className="text-sm text-gray-500">Soil Moisture</div>
            <div className={`text-sm font-medium mt-1 ${condition.color}`}>
              {condition.label}
            </div>
          </div>
          <div className="text-center p-4 bg-gray-200 rounded-lg">
            <div className="text-3xl font-bold text-gray-900">{sensor.temperature}°C</div>
            <div className="text-sm text-gray-500">Temperature</div>
          </div>
          <div className="text-center p-4 bg-gray-200 rounded-lg">
            <div className="text-3xl font-bold text-gray-900">{sensor.humidity}%</div>
            <div className="text-sm text-gray-500">Humidity</div>
          </div>
        </div>
      </div>

      {/* Live Moisture Tracking Graph */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-green-400 shadow-green-200 shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4">Live Moisture Tracking</h2>
        <p className="text-sm text-gray-500 mb-4">Last {sensor.history.length} readings</p>
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
        {sensor.history.length === 0 && (
          <p className="text-center text-gray-500 mt-4">No historical data available for this sensor</p>
        )}
      </div>
    </div>
  );
}