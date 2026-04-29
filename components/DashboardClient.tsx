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
  const [refreshKey, setRefreshKey] = useState(0);

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
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleRefreshRecommendations = () => {
    setRefreshKey(prev => prev + 1);
  };

  if (loading) return <div className="text-center py-8">Loading sensor data...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  if (!data) return <div className="text-center py-8">No data available</div>;

  const nodes = Object.entries(data.Soil_Moisture || {});
  const firstNodeId = nodes[0]?.[0] || 'Node_1';
  const currentMoisture = data.Soil_Moisture?.[firstNodeId] || 0;

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
        key={refreshKey}
        moisture={currentMoisture}
        temperature={data.Temperature}
        humidity={data.Humidity}
        onRefresh={handleRefreshRecommendations}
      />
    </div>
  );
}