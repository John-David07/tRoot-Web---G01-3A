interface SensorCardProps {
  nodeId: string;
  moisture: number;
  temperature: number;
  humidity: number;
}

export function SensorCard({ nodeId, moisture, temperature, humidity }: SensorCardProps) {
  const getCondition = (value: number) => {
    if (value > 80) return { label: 'Wet', color: 'text-blue-600 bg-blue-100' };
    if (value > 40) return { label: 'Optimal', color: 'text-green-600 bg-green-100' };
    if (value > 10) return { label: 'Dry', color: 'text-orange-600 bg-orange-100' };
    return { label: 'Critical', color: 'text-red-600 bg-red-100' };
  };

  const condition = getCondition(moisture);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {nodeId.replace('_', ' ')}
        </h3>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${condition.color}`}>
          {condition.label}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{moisture}%</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Moisture</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{temperature}°C</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Temp</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{humidity}%</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Humidity</div>
        </div>
      </div>
    </div>
  );
}