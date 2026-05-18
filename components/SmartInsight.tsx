interface SmartInsightProps {
  temperature: number;
  humidity: number;
}

export function SmartInsight({ temperature, humidity }: SmartInsightProps) {
  const getInsight = () => {
    if (temperature > 30) {
      return {
        message: "High temperature detected. Consider moving plants away from direct sunlight.",
        type: "warning"
      };
    }
    if (humidity < 40) {
      return {
        message: "Low humidity. Consider misting your plants.",
        type: "warning"
      };
    }
    return {
      message: "Optimal for Growth: Current conditions are perfect for tropical varieties. No action needed.",
      type: "success"
    };
  };

  const insight = getInsight();
  
  const bgColor = insight.type === 'success' 
    ? 'bg-green-50 dark:bg-green-900/20' 
    : 'bg-yellow-50 dark:bg-yellow-900/20';
  const textColor = insight.type === 'success' 
    ? 'text-green-700 dark:text-green-300' 
    : 'text-yellow-700 dark:text-yellow-300';
  const borderColor = insight.type === 'success' 
    ? 'border-green-200 dark:border-green-800' 
    : 'border-yellow-200 dark:border-yellow-800';

  return (
    <div className={`rounded-lg border ${borderColor} p-4 ${bgColor}`}>
      <h3 className={`font-semibold mb-1 ${textColor}`}>
        Smart Insight
      </h3>
      <p className="text-sm text-gray-700 dark:text-gray-300">
        {insight.message}
      </p>
    </div>
  );
}