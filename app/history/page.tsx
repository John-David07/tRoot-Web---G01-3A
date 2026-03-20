'use client';

import { useEffect, useState } from 'react';

interface HistoryRecord {
  id: string;
  timestamp: string;
  humidity: number;
  temperature: number;
  soilMoisture: Record<string, number>;
}

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSensor, setSelectedSensor] = useState('all');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch('/api/sensors/history');
        const data = await res.json();
        setHistory(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) return <div className="text-center py-8">Loading history...</div>;

  const getCondition = (value: number) => {
    if (value > 80) return { label: 'Wet', color: 'text-blue-600' };
    if (value > 40) return { label: 'Optimal', color: 'text-green-600' };
    if (value > 10) return { label: 'Dry', color: 'text-orange-600' };
    return { label: 'Critical', color: 'text-red-600' };
  };

  // Get all unique sensor nodes from history
  const sensors = history.length > 0 && history[0]?.soilMoisture
    ? Object.keys(history[0].soilMoisture)
    : ['Node_1', 'Node_2', 'Node_3', 'Node_4', 'Node_5'];

  const filteredHistory = selectedSensor === 'all'
    ? history
    : history.filter(record => record.soilMoisture?.[selectedSensor] !== undefined);

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-app min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-white mb-2">Sensor Hub</h1>
        <p className="text-white mb-6">Recent Readings</p>

        {/* Filter */}
        <div className="mb-6">
          <select
            value={selectedSensor}
            onChange={(e) => setSelectedSensor(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
          >
            <option value="all">All Sensors</option>
            {sensors.map(sensor => (
              <option key={sensor} value={sensor}>
                {sensor.replace('_', ' ')}
              </option>
            ))}
          </select>
        </div>

        {/* History List */}
        <div className="space-y-4">
          {filteredHistory.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No history data available</p>
          ) : (
            filteredHistory.map((record) => (
              <div key={record.id} className="bg-white rounded-lg shadow-md p-4 border border-green-400 shadow-green-200">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className="text-sm text-gray-500">{formatDate(record.timestamp)}</span>
                  </div>
                  <span className="text-xs text-gray-400">Updated</span>
                </div>
                
                {selectedSensor === 'all' ? (
                  // Show all sensors
                  <div className="space-y-2">
                    {Object.entries(record.soilMoisture || {}).map(([node, value]) => {
                      const condition = getCondition(value);
                      return (
                        <div key={node} className="flex justify-between items-center py-1 border-b border-gray-100">
                          <div className="flex items-center gap-2">
                            <span>💧</span>
                            <span className="font-medium text-gray-700">{node.replace('_', ' ')}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-semibold text-gray-800">{value}%</span>
                            <span className={`text-xs ml-2 ${condition.color}`}>{condition.label}</span>
                          </div>
                        </div>
                      );
                    })}
                    <div className="flex justify-between pt-2">
                      <span className="text-sm text-gray-600">Temperature</span>
                      <span className="text-sm font-medium">{record.temperature}°C</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Humidity</span>
                      <span className="text-sm font-medium">{record.humidity}%</span>
                    </div>
                  </div>
                ) : (
                  // Show selected sensor only
                  (() => {
                    const moisture = record.soilMoisture?.[selectedSensor] || 0;
                    const condition = getCondition(moisture);
                    return (
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <span>💧</span>
                            <span className="text-gray-600">Moisture Level</span>
                          </div>
                          <div className="text-right">
                            <span className="text-xl font-bold text-gray-900">{moisture}%</span>
                            <span className={`text-sm ml-2 ${condition.color}`}>{condition.label}</span>
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Temperature</span>
                          <span className="font-medium">{record.temperature}°C</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Humidity</span>
                          <span className="font-medium">{record.humidity}%</span>
                        </div>
                      </div>
                    );
                  })()
                )}
              </div>
            ))
          )}
        </div>

        <p className="text-center text-sm text-gray-400 mt-6">
          Showing {filteredHistory.length} records
        </p>
      </div>
    </div>
  );
}