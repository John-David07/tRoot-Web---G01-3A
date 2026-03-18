interface SensorCardProps {
  nodeId: string;
  moisture: number;
  temperature: number;
  humidity: number;
}

export function SensorCard({ nodeId, moisture, temperature, humidity }: SensorCardProps) {
  const getCondition = (value: number) => {
    if (value > 80) return { 
      label: 'Wet', 
      color: 'text-blue-600 bg-blue-100',
      barColor: 'bg-blue-500'
    };
    if (value > 40) return { 
      label: 'Optimal', 
      color: 'text-primary bg-primary-light',
      barColor: 'bg-green-600'
    };
    if (value > 10) return { 
      label: 'Dry', 
      color: 'text-warning bg-orange-100',
      barColor: 'bg-orange-600'
    };
    return { 
      label: 'Critical', 
      color: 'text-danger bg-red-100',
      barColor: 'bg-red-600'
    };
  };

  const condition = getCondition(moisture);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            {nodeId.replace('_', ' ')}
          </h3>
          <p className="text-sm text-gray-500">Living Room</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${condition.color}`}>
          {condition.label}
        </span>
      </div>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm text-gray-600">Moisture Level</span>
          <span className="text-sm font-medium text-gray-800">{moisture}%</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className={`h-full ${condition.barColor}`}
            style={{ width: `${moisture}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-xl font-bold text-gray-800">{temperature}°C</div>
          <div className="text-xs text-gray-500">Temperature</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-xl font-bold text-gray-800">{humidity}%</div>
          <div className="text-xs text-gray-500">Humidity</div>
        </div>
      </div>
    </div>
  );
}