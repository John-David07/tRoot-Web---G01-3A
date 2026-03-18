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
  const colors = insight.type === 'success' 
    ? 'bg-green-50 border-green-200 text-green-700'
    : 'bg-yellow-50 border-yellow-200 text-yellow-700';

  return (
    <div className={`rounded-lg border p-4 ${colors}`}>
      <h3 className="font-semibold mb-1">Smart Insight</h3>
      <p className="text-sm">{insight.message}</p>
    </div>
  );
}