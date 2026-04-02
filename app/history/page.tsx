'use client';

import { useEffect, useState, useCallback } from 'react';

interface HistoryRecord {
  id: string;
  timestamp: string;
  moisture: number;
  date: Date;
}

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSensor, setSelectedSensor] = useState('Node_1');
  const [allData, setAllData] = useState<any>(null);

  // Fetch data once on mount
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch('/api/sensors/history');
        const data = await res.json();
        setAllData(data);
      } catch (error) {
        console.error('Error fetching history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []); // Empty array - only runs once

  // Process data whenever selectedSensor or allData changes
  useEffect(() => {
    if (!allData) return;

    // Find the Soil_Sensor object in the array
    const soilSensorData = Array.isArray(allData) 
      ? allData.find((item: any) => item.id === 'Soil_Sensor')
      : null;
    
    if (!soilSensorData) {
      console.log('No Soil_Sensor data found');
      setHistory([]);
      return;
    }
    
    // Parse the selected sensor's data
    const sensorData = soilSensorData[selectedSensor];
    
    if (!sensorData) {
      console.log(`No data for ${selectedSensor}`);
      setHistory([]);
      return;
    }
    
    // Parse all entries
    const parsedHistory: HistoryRecord[] = [];
    const entries = Object.entries(sensorData);
    
    entries.forEach(([pushId, value]) => {
      let moistureValue = 0;
      
      // Handle both formats: direct number or {time, value} object
      if (typeof value === 'number') {
        moistureValue = value;
      } else if (value && typeof value === 'object' && 'value' in value) {
        moistureValue = (value as { value: number }).value;
      } else {
        return; // Skip invalid entries
      }
      
      // Get timestamp from Firebase push ID (contains timestamp in milliseconds)
      let recordDate = new Date();
      if (pushId && pushId.length > 0) {
        // Firebase push IDs contain a timestamp in milliseconds
        // Example: -OnYQNlnnbdfKU0mRWFx - the timestamp is in the first part
        const timestampMs = Date.now(); // Fallback to current time
        
        // Try to extract time from the push ID's first 8 chars (hex)
        if (pushId.length >= 8 && pushId[0] === '-') {
          const hexPart = pushId.substring(1, 9); // Skip the leading '-'
          try {
            const timeValue = parseInt(hexPart, 16);
            if (!isNaN(timeValue) && timeValue > 1000000) {
              recordDate = new Date(timeValue);
            }
          } catch (e) {
            // Fallback to current time
          }
        }
      }
      
      parsedHistory.push({
        id: pushId,
        timestamp: pushId,
        moisture: moistureValue,
        date: recordDate,
      });
    });
    
    // Sort by date (newest first)
    parsedHistory.sort((a, b) => b.date.getTime() - a.date.getTime());
    
    setHistory(parsedHistory);
  }, [selectedSensor, allData]); // Re-run when selectedSensor changes

  if (loading) return <div className="text-center py-8">Loading history...</div>;

  const getCondition = (value: number) => {
    if (value > 80) return { label: 'Wet', color: 'text-blue-600 bg-blue-50' };
    if (value > 40) return { label: 'Optimal', color: 'text-green-600 bg-green-50' };
    return { label: 'Dry', color: 'text-orange-600 bg-orange-50' };
  };

  const formatDate = (date: Date) => {
    if (isNaN(date.getTime())) {
      return 'Unknown date';
    }
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const sensors = ['Node_1', 'Node_2', 'Node_3', 'Node_4', 'Node_5'];

  return (
    <div className="bg-app min-h-screen">
      <div className="container mx-auto px-4 py-8 pb-24">
        <h1 className="text-2xl font-bold text-gray-200 mb-2">Sensor Reading History</h1>
        <p className="text-gray-100 mb-6">Recent Readings</p>

        {/* Filter */}
        <div className="mb-6">
          <select
            value={selectedSensor}
            onChange={(e) => setSelectedSensor(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
          >
            {sensors.map(sensor => (
              <option key={sensor} value={sensor}>
                {sensor.replace('_', ' ')}
              </option>
            ))}
          </select>
        </div>

        {/* History List */}
        <div className="space-y-3">
          {history.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No history data available for {selectedSensor.replace('_', ' ')}</p>
          ) : (
            history.slice(0, 50).map((record, index) => {
              const condition = getCondition(record.moisture);
              return (
                <div key={`${record.id}-${index}`} className="bg-white rounded-lg shadow-sm p-4 border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="flex items-center gap-2">
                        <span>💧</span>
                        <span className="font-medium text-gray-700">{selectedSensor.replace('_', ' ')}</span>
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {formatDate(record.date)}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-gray-800">{record.moisture}%</span>
                      <div className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block ${condition.color}`}>
                        {condition.label}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {history.length > 50 && (
          <p className="text-center text-sm text-gray-400 mt-6">
            Showing 50 of {history.length} records
          </p>
        )}
      </div>
    </div>
  );
}