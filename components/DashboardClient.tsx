'use client';

import { useEffect, useState } from 'react';
import { SensorCard } from './SensorCard';
import { SmartInsight } from './SmartInsight';
import { PlantRecommendations } from './PlantRecommendations';

interface SensorData {
  Humidity: number;
  Temperature: number;
  Soil_Moisture: Record<string, number>;
}

export default function DashboardClient() {
  const [data, setData] = useState<SensorData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/sensors/current');
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // Refresh every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="text-center py-8">Loading sensor data...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  if (!data) return <div className="text-center py-8">No data available</div>;

  const nodes = Object.entries(data.Soil_Moisture || {});

  return (
    <div className="space-y-6">
      <SmartInsight 
        temperature={data.Temperature} 
        humidity={data.Humidity}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {nodes.map(([nodeId, value]) => (
          <SensorCard
            key={nodeId}
            nodeId={nodeId}
            moisture={value}
            temperature={data.Temperature}
            humidity={data.Humidity}
          />
        ))}
      </div>

      <PlantRecommendations 
        moisture={data.Soil_Moisture?.Node_1 || 0}  // Use first sensor's moisture
        temperature={data.Temperature}
        humidity={data.Humidity}
      />
    </div>
  );
}